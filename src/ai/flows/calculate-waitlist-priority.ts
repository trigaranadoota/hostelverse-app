'use server';
/**
 * @fileOverview A flow to calculate and rank users on a hostel's waiting list based on a priority score.
 * 
 * - calculateWaitlistPriority - Ranks users based on a calculated score.
 * - WaitlistPriorityInput - The input type for the calculateWaitlistPriority flow.
 * - WaitlistPriorityOutput - The return type for the calculateWaitlistPriority flow.
 */
import { UserProfile } from '@/lib/types';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getFirestore } from 'firebase-admin/firestore';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

const UserProfileSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    annualIncome: z.number().optional().default(0),
    category: z.string().optional().default('general'),
    distance: z.number().optional().default(0),
    score10th: z.number().optional().default(0),
    score12th: z.number().optional().default(0),
});

export const WaitlistPriorityInputSchema = z.object({
  hostelId: z.string().describe("The ID of the hostel for which to calculate the waitlist priority."),
});

export type WaitlistPriorityInput = z.infer<typeof WaitlistPriorityInputSchema>;

const RankedUserSchema = z.object({
    userId: z.string(),
    rank: z.number(),
    score: z.number(),
    scoreBreakdown: z.object({
        income: z.number(),
        category: z.number(),
        distance: z.number(),
        academics: z.number(),
    })
});

export const WaitlistPriorityOutputSchema = z.object({
  rankedUsers: z.array(RankedUserSchema),
});

export type WaitlistPriorityOutput = z.infer<typeof WaitlistPriorityOutputSchema>;

// Initialize Firebase Admin SDK
function getDb() {
  if (getApps().length === 0) {
    initializeApp();
  }
  return getFirestore();
}

function calculatePriorityScore(user: UserProfile) {
    // --- 1. INCOME CALCULATION (Exact Tiers) ---
    let incomePoints = 0;
    const income = user.annualIncome || 0;

    if (income <= 400000) {
        incomePoints = 30;
    } else if (income <= 800000) {
        incomePoints = 25;
    } else if (income <= 1200000) {
        incomePoints = 20;
    } else if (income <= 1600000) {
        incomePoints = 15;
    } else if (income <= 2000000) {
        incomePoints = 10;
    } else if (income <= 2400000) {
        incomePoints = 5;
    } else {
        incomePoints = 0; // Above 24L
    }

    // --- 2. CATEGORY CALCULATION ---
    let categoryPoints = 0;
    const category = (user.category || 'general').toLowerCase().trim(); 

    switch (category) {
        case "physically challenged":
        case "pc": 
            categoryPoints = 25; // Highest Priority
            break;
        case "sc":
        case "st":
        case "sc/st":
            categoryPoints = 20;
            break;
        case "obc":
            categoryPoints = 15;
            break;
        case "general":
            categoryPoints = 10;
            break;
        default:
            categoryPoints = 10; // Default to General if undefined
    }

    // --- 3. DISTANCE CALCULATION (Max 25km) ---
    const MAX_DIST_POINTS = 25;
    const MAX_KM_CAP = 25;
    
    let effectiveDistance = (user.distance || 0) > MAX_KM_CAP ? MAX_KM_CAP : (user.distance || 0);
    let distancePoints = (effectiveDistance / MAX_KM_CAP) * MAX_DIST_POINTS;

    // --- 4. ACADEMIC SCORE (Merit) ---
    const MAX_ACADEMIC_POINTS = 20;
    let averageScore = ((user.score10th || 0) + (user.score12th || 0)) / 2;
    let academicPoints = (averageScore / 100) * MAX_ACADEMIC_POINTS;

    // --- FINAL TOTAL ---
    const totalScore = incomePoints + categoryPoints + distancePoints + academicPoints;

    return {
        total: parseFloat(totalScore.toFixed(2)),
        breakdown: {
            income: incomePoints,
            category: categoryPoints,
            distance: parseFloat(distancePoints.toFixed(2)),
            academics: parseFloat(academicPoints.toFixed(2))
        }
    };
}


const calculateWaitlistPriorityFlow = ai.defineFlow(
  {
    name: 'calculateWaitlistPriorityFlow',
    inputSchema: WaitlistPriorityInputSchema,
    outputSchema: WaitlistPriorityOutputSchema,
  },
  async (input) => {
    const db = getDb();
    
    // 1. Get all wishlist items for the given hostelId
    const wishlistSnapshot = await db.collectionGroup('wishlist').where('hostelId', '==', input.hostelId).get();
    if (wishlistSnapshot.empty) {
      return { rankedUsers: [] };
    }
    const userIds = wishlistSnapshot.docs.map(doc => doc.data().userId);

    // 2. Fetch all user profiles for those userIds
    const userProfiles: UserProfile[] = [];
    for (const userId of userIds) {
      const profileDoc = await db.collection('users').doc(userId).collection('profile').doc(userId).get();
      if (profileDoc.exists) {
        userProfiles.push(profileDoc.data() as UserProfile);
      }
    }
    
    // 3. Calculate score for each user
    const usersWithScores = userProfiles.map(user => {
      const scoreInfo = calculatePriorityScore(user);
      return {
        userId: user.id,
        score: scoreInfo.total,
        scoreBreakdown: scoreInfo.breakdown,
      };
    });

    // 4. Sort users by score (descending)
    usersWithScores.sort((a, b) => b.score - a.score);

    // 5. Assign rank
    const rankedUsers = usersWithScores.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return { rankedUsers };
  }
);


export async function calculateWaitlistPriority(input: WaitlistPriorityInput): Promise<WaitlistPriorityOutput> {
    return calculateWaitlistPriorityFlow(input);
}

    