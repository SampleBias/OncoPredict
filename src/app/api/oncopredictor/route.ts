import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    sample_id: "HMF000185A",
    predictions: [
      { cancer_type: "Sarcoma_Lipo", probability: 0.57 },
      { cancer_type: "Sarcoma_Other", probability: 0.47 },
      { cancer_type: "NET_Pancreas", probability: 0.04 },
      { cancer_type: "Other1", probability: 0.0 },
      { cancer_type: "Other2", probability: 0.0 },
      { cancer_type: "Other3", probability: 0.0 },
      { cancer_type: "Other4", probability: 0.0 },
      { cancer_type: "Other5", probability: 0.0 },
      { cancer_type: "Other6", probability: 0.0 },
      { cancer_type: "Other7", probability: 0.0 },
    ],
    features_top1: [
      { name: "fusion.FUS_DDIT3", contribution: 0.25, comparison: "(Higher)" },
      { name: "sigs.SBS8", contribution: 0.15, comparison: "(Lower)" },
    ],
    features_top2: [
      { name: "fusion.EWSR1_FLI1", contribution: 0.20, comparison: "(Higher)" },
      { name: "rmd.MYC", contribution: 0.10, comparison: "(Lower)" },
    ],
    feature_values: [
      { sample: 1, cancer_avg: 0.8, other_avg: 0.2, scale_label: "Occurrence" },
      { sample: 0.3, cancer_avg: 0.1, other_avg: 0.4, scale_label: "Prop. of SBSs", max_value: 1 },
      { sample: 1, cancer_avg: 0.7, other_avg: 0.3, scale_label: "Occurrence" },
      { sample: 0.2, cancer_avg: 0.4, other_avg: 0.6, scale_label: "Prop. of indels", max_value: 1 },
    ],
  };

  return NextResponse.json(data);
}
