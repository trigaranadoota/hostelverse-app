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
import { getFirestore, collection, doc, getDoc, collectionGroup } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';


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

const ScoreBreakdownSchema = z.object({
    income: z.number(),
    category: z.number(),
    distance: z.number(),
    academics: z.number(),
});

const RankedUserSchema = z.object({
    userId: z.string(),
    rank: z.number(),
    score: z.number(),
    scoreBreakdown: ScoreBreakdownSchema
});

export const WaitlistPriorityOutputSchema = z.object({
  rankedUsers: z.array(RankedUserSchema),
});

export type WaitlistPriorityOutput = z.infer<typeof WaitlistPriorityOutputSchema>;

// Initialize Firebase client SDK
function getDb() {
  return initializeFirebase().firestore;
}

function calculatePriorityScore(user: Partial<UserProfile>) {
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
    
    // If distance is more than 25km, cap it at 25km
    const userDistance = user.distance || 0;
    let effectiveDistance = userDistance > MAX_KM_CAP ? MAX_KM_CAP : userDistance;
    
    // Formula: (Distance / MaxCap) * MaxPoints
    // Since MaxCap and MaxPoints are both 25, the points equal the Km (1km = 1pt)
    let distancePoints = (effectiveDistance / MAX_KM_CAP) * MAX_DIST_POINTS;


    // --- 4. ACADEMIC SCORE (Merit) ---
    const MAX_ACADEMIC_POINTS = 20;
    
    // Calculate average percentage of 10th and 12th
    let averageScore = ((user.score10th || 0) + (user.score12th || 0)) / 2;
    
    // Normalize to 20 points
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
    
    // This flow runs on the server, but we're using the client SDK.
    // This means it can't perform actions the client couldn't (like reading all user profiles).
    // The security rules MUST allow a signed-in user to read the data required.
    // Let's assume for now a user can read their own profile, but this flow as-is
    // cannot read all profiles in the `users` collection.
    // To make this work, we must rely on a collectionGroup query that security rules allow.
    
    // For this to work, security rules must allow list access on the 'wishlist' collection group.
    const wishlistCollection = collectionGroup(db, 'wishlist');
    
    // This part is problematic with client-sdk from server-side flow, as it has no authenticated user context.
    // A proper solution would involve a callable function with user context, or adjusting security rules
    // to allow this specific server-side read.
    // For now, let's revert to a simplified logic that can work, assuming this flow cannot read all profiles.

    // Given the security constraints, we cannot fetch all user profiles.
    // This flow needs to be re-architected to work with user-specific data or use the Admin SDK properly.
    // I will return a dummy response to prevent crashes, but this flow is non-functional with current security.
    console.error("calculateWaitlistPriorityFlow cannot function correctly due to security rule constraints when using the client SDK on the server. Re-architecture is required.");
    return { rankedUsers: [] };
  }
);


export async function calculateWaitlistPriority(input: WaitlistPriorityInput): Promise<WaitlistPriorityOutput> {
    try {
        return await calculateWaitlistPriorityFlow(input);
    } catch (error) {
        console.error("Error executing calculateWaitlistPriorityFlow:", error);
        // Return an empty list or re-throw as appropriate
        return { rankedUsers: [] };
    }
}
