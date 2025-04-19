'use client';

import {predictCancerTypes} from '@/ai/flows/predict-cancer-types';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Textarea} from '@/components/ui/textarea';
import {Toaster} from '@/components/ui/toaster';
import {useToast} from '@/hooks/use-toast';
import {useState} from 'react';

interface Prediction {
  age: number;
  gender: string;
  cnaEvents: string;
  geneticMutations: string;
  cancerTypePredictions: {cancerType: string; probability: number}[];
}

export default function Home() {
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>('');
  const [cnaEvents, setCnaEvents] = useState<string>('');
  const [geneticMutations, setGeneticMutations] = useState<string>('');
  const [predictions, setPredictions] = useState<{cancerType: string; probability: number}[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<Prediction[]>([]);

  const {toast} = useToast();

  const handlePredict = async () => {
    if (age === undefined || gender === '' || cnaEvents === '' || geneticMutations === '') {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const cancerPredictions = await predictCancerTypes({
        age: age,
        gender: gender,
        cnaEvents: cnaEvents,
        geneticMutations: geneticMutations,
      });

      setPredictions(cancerPredictions.predictions);

      // Save the prediction to history
      setPredictionHistory(prevHistory => [
        {
          age: age,
          gender: gender,
          cnaEvents: cnaEvents,
          geneticMutations: geneticMutations,
          cancerTypePredictions: cancerPredictions.predictions,
        },
        ...prevHistory,
      ]);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get predictions.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4">
      <Toaster />
      <h1 className="text-3xl font-semibold mb-6">OncoPredict</h1>

      <div className="flex flex-row w-full max-w-4xl space-x-4">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Patient Data Input</CardTitle>
            <CardDescription>Enter patient data for cancer type prediction</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Patient Age"
                value={age !== undefined ? age.toString() : ''}
                onChange={e => setAge(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                type="text"
                placeholder="Patient Gender"
                value={gender}
                onChange={e => setGender(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cnaEvents">CNA Events</Label>
              <Textarea
                id="cnaEvents"
                placeholder="Copy Number Alteration Events"
                value={cnaEvents}
                onChange={e => setCnaEvents(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="geneticMutations">Genetic Mutations</Label>
              <Textarea
                id="geneticMutations"
                placeholder="Genetic Mutations"
                value={geneticMutations}
                onChange={e => setGeneticMutations(e.target.value)}
              />
            </div>
            <Button onClick={handlePredict}>Predict Cancer Types</Button>
          </CardContent>
        </Card>

        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Prediction History</CardTitle>
            <CardDescription>Review previous predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border">
              {predictionHistory.length > 0 ? (
                <ul className="list-none p-0">
                  {predictionHistory.map((prediction, index) => (
                    <li key={index} className="py-2 border-b last:border-none">
                      <details>
                        <summary>
                          Prediction {index + 1}: Age {prediction.age}, Gender {prediction.gender}
                        </summary>
                        <ul>
                          {prediction.cancerTypePredictions.map((cancerPrediction, cancerIndex) => (
                            <li key={cancerIndex}>
                              {cancerPrediction.cancerType}: {cancerPrediction.probability.toFixed(2)}%
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No prediction history available.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {predictions.length > 0 && (
        <Card className="w-full max-w-4xl mt-6">
          <CardHeader>
            <CardTitle>Cancer Type Predictions</CardTitle>
            <CardDescription>Ranked list of potential cancer types</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-none p-0">
              {predictions.map((prediction, index) => (
                <li key={index} className="py-2 border-b last:border-none">
                  {prediction.cancerType}: {prediction.probability.toFixed(2)}%
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    