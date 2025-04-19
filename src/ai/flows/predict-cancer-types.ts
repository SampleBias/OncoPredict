// src/ai/flows/predict-cancer-types.ts
'use server';
/**
 * @fileOverview Predicts potential cancer types with probability percentages based on patient data.
 *
 * - predictCancerTypes - A function that handles the cancer type prediction process.
 * - PredictCancerTypesInput - The input type for the predictCancerTypes function.
 * - PredictCancerTypesOutput - The return type for the predictCancerTypes function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PredictCancerTypesInputSchema = z.object({
  age: z.number().describe('The age of the patient.'),
  gender: z.string().describe('The gender of the patient.'),
  cnaEvents: z.string().describe('Copy Number Alteration events.'),
  geneticMutations: z.string().describe('Genetic mutations.'),
});
export type PredictCancerTypesInput = z.infer<typeof PredictCancerTypesInputSchema>;

const PredictCancerTypesOutputSchema = z.object({
  predictions: z.array(
    z.object({
      cancerType: z.string().describe('The predicted cancer type.'),
      probability: z.number().describe('The probability percentage of the cancer type.'),
    })
  ).describe('A ranked list of potential cancer types with probability percentages.'),
});
export type PredictCancerTypesOutput = z.infer<typeof PredictCancerTypesOutputSchema>;

export async function predictCancerTypes(input: PredictCancerTypesInput): Promise<PredictCancerTypesOutput> {
  return predictCancerTypesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictCancerTypesPrompt',
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
  prompt: `You are an expert oncologist. Based on the patient data provided, predict potential cancer types with probability percentages. The probabilities should sum to 100%.

Patient Data:
Age: {{{age}}}
Gender: {{{gender}}}
CNA Events: {{{cnaEvents}}}
Genetic Mutations: {{{geneticMutations}}}

Format the results as a JSON array of objects, where each object has a cancerType and a probability field.
`,
});

const predictCancerTypesFlow = ai.defineFlow<
  typeof PredictCancerTypesInputSchema,
  typeof PredictCancerTypesOutputSchema
>({
  name: 'predictCancerTypesFlow',
  inputSchema: PredictCancerTypesInputSchema,
  outputSchema: PredictCancerTypesOutputSchema,
}, 
async input => {
  const {output} = await prompt(input);
  return output!;
});
