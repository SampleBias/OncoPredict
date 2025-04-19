// src/ai/flows/present-cancer-predictions.ts
'use server';
/**
 * @fileOverview Presents ranked cancer types with probability percentages.
 *
 * - presentCancerTypePredictions - A function that handles the presentation of cancer type predictions.
 * - PresentCancerTypePredictionsInput - The input type for the presentCancerTypePredictions function.
 * - PresentCancerTypePredictionsOutput - The return type for the presentCancerTypePredictions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PresentCancerTypePredictionsInputSchema = z.object({
  age: z.number().describe('The age of the patient.'),
  gender: z.string().describe('The gender of the patient.'),
  cnaEvents: z.string().describe('Copy Number Alteration events.'),
  geneticMutations: z.string().describe('Genetic mutations.'),
});
export type PresentCancerTypePredictionsInput = z.infer<typeof PresentCancerTypePredictionsInputSchema>;

const PresentCancerTypePredictionsOutputSchema = z.object({
  predictions: z.array(
    z.object({
      cancerType: z.string().describe('The predicted cancer type.'),
      probability: z.number().describe('The probability percentage of the cancer type.'),
    })
  ).describe('A ranked list of potential cancer types with probability percentages.'),
});
export type PresentCancerTypePredictionsOutput = z.infer<typeof PresentCancerTypePredictionsOutputSchema>;

export async function presentCancerTypePredictions(input: PresentCancerTypePredictionsInput): Promise<PresentCancerTypePredictionsOutput> {
  return presentCancerTypePredictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'presentCancerTypePredictionsPrompt',
  input: {
    schema: z.object({
      age: z.number().describe('The age of the patient.'),
      gender: z.string().describe('The gender of the patient.'),
      cnaEvents: z.string().describe('Copy Number Alteration events.'),
      geneticMutations: z.string().describe('Genetic mutations.'),
    }),
  },
  output: {
    schema: z.object({
      predictions: z.array(
        z.object({
          cancerType: z.string().describe('The predicted cancer type.'),
          probability: z.number().describe('The probability percentage of the cancer type.'),
        })
      ).describe('A ranked list of potential cancer types with probability percentages.'),
    }),
  },
  prompt: `You are an expert oncologist. Based on the patient data provided, present a ranked list of potential cancer types with probability percentages. The probabilities should sum to 100%.

Patient Data:
Age: {{{age}}}
Gender: {{{gender}}}
CNA Events: {{{cnaEvents}}}
Genetic Mutations: {{{geneticMutations}}}

Format the results as a JSON array of objects, where each object has a cancerType and a probability field.
`,
});

const presentCancerTypePredictionsFlow = ai.defineFlow<
  typeof PresentCancerTypePredictionsInputSchema,
  typeof PresentCancerTypePredictionsOutputSchema
>({
  name: 'presentCancerTypePredictionsFlow',
  inputSchema: PresentCancerTypePredictionsInputSchema,
  outputSchema: PresentCancerTypePredictionsOutputSchema,
}, 
async input => {
  const {output} = await prompt(input);
  return output!;
});
