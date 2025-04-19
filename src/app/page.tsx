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
import {PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import ShapPlot from '@/components/ShapPlot';
import ComplexShapPlot from '@/components/ComplexShapPlot';
import OncoPredictorPlot from '@/components/OncoPredictorPlot';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Prediction {
  age: number;
  gender: string;
  cnaEvents: string;
  geneticMutations: string;
  cancerTypePredictions: {cancerType: string; probability: number}[];
}

const COLORS = ['#884d6f', '#a45a7f', '#c0678f', '#dc749f', '#f881af']; // Maroon shades

export default function Home() {
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>('');
  const [cnaEvents, setCnaEvents] = useState<string>('');
  const [geneticMutations, setGeneticMutations] = useState<string>('');
  const [predictions, setPredictions] = useState<{cancerType: string; probability: number}[]>([]);
  const [predictionHistory, setPredictionHistory] = useState<Prediction[]>([]);
  const [shapPlotType, setShapPlotType] = useState<string>("simple");

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

  const renderPieChart = () => {
    if (!predictions || predictions.length === 0) {
      return <p className="text-sm text-muted-foreground">No predictions available for Pie Chart.</p>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={predictions} dataKey="probability" nameKey="cancerType" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
            {predictions.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => {
    if (!predictions || predictions.length === 0) {
      return <p className="text-sm text-muted-foreground">No predictions available for Bar Chart.</p>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={predictions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cancerType" />
          <YAxis domain={[0, 100]}/>
          <Tooltip />
          <Legend />
          <Bar dataKey="probability" fill={COLORS[0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4 text-primary">OncoPredict</h1>

      <div className="flex flex-row w-full max-w-4xl space-x-6">
        <Card className="w-1/2 bg-secondary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Patient Data Input</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Enter patient data for cancer type prediction
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="age" className="text-sm">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Patient Age"
                value={age !== undefined ? age.toString() : ''}
                onChange={e => setAge(Number(e.target.value))}
                className="bg-input text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender" className="text-sm">
                Gender
              </Label>
              <Input
                id="gender"
                type="text"
                placeholder="Patient Gender"
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="bg-input text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cnaEvents" className="text-sm">
                CNA Events
              </Label>
              <Textarea
                id="cnaEvents"
                placeholder="Copy Number Alteration Events"
                value={cnaEvents}
                onChange={e => setCnaEvents(e.target.value)}
                className="bg-input text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="geneticMutations" className="text-sm">
                Genetic Mutations
              </Label>
              <Textarea
                id="geneticMutations"
                placeholder="Genetic Mutations"
                value={geneticMutations}
                onChange={e => setGeneticMutations(e.target.value)}
                className="bg-input text-sm"
              />
            </div>
            <Button onClick={handlePredict} className="bg-primary text-primary-foreground text-sm">
              Predict Cancer Types
            </Button>
          </CardContent>
        </Card>

        <Card className="w-1/2 bg-secondary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Prediction History</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Review previous predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md">
              {predictionHistory.length > 0 ? (
                <ul className="list-none p-0">
                  {predictionHistory.map((prediction, index) => (
                    <li key={index} className="py-2 border-b last:border-none border-border">
                      <details>
                        <summary className="text-sm cursor-pointer">
                          Prediction {index + 1}: Age {prediction.age}, Gender {prediction.gender}
                        </summary>
                        <ul className="list-disc pl-5 mt-2">
                          {prediction.cancerTypePredictions.map((cancerPrediction, cancerIndex) => (
                            <li key={cancerIndex} className="text-xs">
                              {cancerPrediction.cancerType}: {cancerPrediction.probability.toFixed(2)}%
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No prediction history available.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {predictions.length > 0 && (
        <div className="w-full max-w-4xl mt-6">
          <Tabs defaultvalue="charts" className="w-full">
            <TabsList>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="shap">SHAP Plot</TabsTrigger>
            </TabsList>
            <TabsContent value="charts">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-secondary">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Cancer Type Predictions - Pie Chart</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Visual representation of potential cancer types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderPieChart()}</CardContent>
                </Card>

                <Card className="bg-secondary">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Cancer Type Predictions - Bar Chart</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      Comparative analysis of potential cancer types
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderBarChart()}</CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="shap">
              <Card className="bg-secondary">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">SHAP Plot</CardTitle>
                  <Select value={shapPlotType} onValueChange={setShapPlotType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select SHAP Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple SHAP</SelectItem>
                      <SelectItem value="complex">Complex SHAP</SelectItem>
                      <SelectItem value="oncopredictor">OncoPredictor</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardDescription className="text-sm text-muted-foreground">
                  Feature importance for cancer type prediction
                </CardDescription>
                <CardContent>{shapPlotType === "simple" ? <ShapPlot /> : shapPlotType === "complex" ? <ComplexShapPlot /> : <OncoPredictorPlot />}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
