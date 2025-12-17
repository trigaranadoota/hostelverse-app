'use server';
/**
 * @fileOverview This file defines a Genkit flow for verifying hostel images using AI.
 *
 * The flow takes an image as input and returns a verification score indicating the image's authenticity and quality.
 * It exports:
 * - `verifyHostelImage`: A function that triggers the image verification flow.
 * - `VerifyHostelImageInput`: The input type for the verifyHostelImage function.
 * - `VerifyHostelImageOutput`: The output type for the verifyHostelImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyHostelImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the hostel, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyHostelImageInput = z.infer<typeof VerifyHostelImageInputSchema>;

const VerifyHostelImageOutputSchema = z.object({
  verificationScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the likelihood that the image is authentic and of good quality.'
    ),
  isAppropriate: z.boolean().describe('Whether the image is appropriate for the platform.'),
  description: z.string().describe('A description of the image.'),
});
export type VerifyHostelImageOutput = z.infer<typeof VerifyHostelImageOutputSchema>;

export async function verifyHostelImage(
  input: VerifyHostelImageInput
): Promise<VerifyHostelImageOutput> {
  return verifyHostelImageFlow(input);
}

const verifyHostelImagePrompt = ai.definePrompt({
  name: 'verifyHostelImagePrompt',
  input: {schema: VerifyHostelImageInputSchema},
  output: {schema: VerifyHostelImageOutputSchema},
  prompt: `You are an AI assistant specializing in verifying the authenticity and quality of hostel images.

  Analyze the provided image and provide a verification score between 0 and 1. A higher score indicates a higher likelihood that the image is authentic and of good quality. Consider factors such as image resolution, clarity, and whether the image appears to be a realistic representation of a hostel.
  Also check if the image contains innapropriate content, in which case the isAppropriate should be set to false.

  Provide a brief description of the image.

  Image: {{media url=photoDataUri}}`,
});

const verifyHostelImageFlow = ai.defineFlow(
  {
    name: 'verifyHostelImageFlow',
    inputSchema: VerifyHostelImageInputSchema,
    outputSchema: VerifyHostelImageOutputSchema,
  },
  async input => {
    const {output} = await verifyHostelImagePrompt(input);
    return output!;
  }
);
