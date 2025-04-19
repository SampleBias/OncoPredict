// format-patient-data.ts
'use server';

/**
 * @fileOverview Formats patient data into a structured prompt suitable for AI analysis.
 * 
 * - formatPatientData - A function that formats patient data for AI analysis.
 * - FormatPatientDataInput - The input type for the formatPatientData function.
 * - FormatPatientDataOutput - The return type for the formatPatientData function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const FormatPatientDataInputSchema = z.object({
  age: z.number().describe('Patient age'),
  gender: z.string().describe('Patient gender'),
  cnaEvents: z.string().describe('Copy Number Alteration events'),
  geneticMutations: z.string().describe('Genetic mutations'),
});
export type FormatPatientDataInput = z.infer<typeof FormatPatientDataInputSchema>;

const FormatPatientDataOutputSchema = z.object({
  formattedData: z.string().describe('The formatted patient data suitable for AI analysis.'),
});
export type FormatPatientDataOutput = z.infer<typeof FormatPatientDataOutputSchema>;

export async function formatPatientData(input: FormatPatientDataInput): Promise<FormatPatientDataOutput> {
  return formatPatientDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formatPatientDataPrompt',
  input: {
    schema: z.object({
      age: z.number().describe('Patient age'),
      gender: z.string().describe('Patient gender'),
      cnaEvents: z.string().describe('Copy Number Alteration events'),
      geneticMutations: z.string().describe('Genetic mutations'),
    }),
  },
  output: {
    schema: z.object({
      formattedData: z.string().describe('The formatted patient data suitable for AI analysis.'),
    }),
  },
  prompt: `Format the following patient data into a structured format suitable for AI analysis, making it easy to parse and understand. Make sure the format is valid JSON.\n\nPatient Data:\nAge: {{{age}}}\nGender: {{{gender}}}\nCNA Events: {{{cnaEvents}}}\nGenetic Mutations: {{{geneticMutations}}}`,
});

const formatPatientDataFlow = ai.defineFlow<
  typeof FormatPatientDataInputSchema,
  typeof FormatPatientDataOutputSchema
>({
  name: 'formatPatientDataFlow',
  inputSchema: FormatPatientDataInputSchema,
  outputSchema: FormatPatientDataOutputSchema,
}, 
async input => {
  const {output} = await prompt(input);
  return output!;
});
