import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    randid: "DFCI_191611",
    prediction: "Non-Small Cell Lung Cancer",
    probability: 0.843,
    features: ["RBM10", "NF1", "KRAS", "SMARCA4", "EGFR", "KAT6B", "AURKA", "SBS38", "SBS4", "SBS1"],
    values: [0.2, 0.4, 0.6, 0.8, 0.1, 0.3, 0.5, 0.7, 0.9, 0.2],
    shap_values: [0.3, 0.5, 0.2, 0.4, -0.1, -0.3, 0.1, 0.2, -0.4, 0.6],
    feature_groups: ["Somatic Mut.", "Somatic Mut.", "Somatic Mut.", "Somatic Mut.", "CNA events", "CNA events", "CNA events", "Mutation Sig.", "Mutation Sig.", "Mutation Sig."]
  };

  return NextResponse.json(data);
}
