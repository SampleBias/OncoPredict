import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    sample_id: "DFCI_106865",
    prediction: "Pancreatic Adenocarcinoma",
    probability: 0.366,
    features: ["KRAS", "CDKN2A CNA", "BRCA2", "SMAD4 CNA", "MTAP CNA", "Age", "MRE11A", "SMAD4", "SBS38", "TP53"],
    values: [1, -1, 2, -1, -1, 72, 1, 0, 0.41, 0],
    shap_values: [1.6, 0.5, 0.4, 0.3, 0.2, -0.2, -0.3, -0.4, -0.2, -0.6],
    feature_groups: ["Somatic Mut.", "CNA events", "Somatic Mut.", "CNA events", "CNA events", "Age/Sex", "Somatic Mut.", "Somatic Mut.", "Mutation Sig.", "Somatic Mut."]
  };

  return NextResponse.json(data);
}
