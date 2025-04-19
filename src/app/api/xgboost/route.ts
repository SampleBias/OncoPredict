import { NextResponse } from 'next/server';

// Read Vertex AI endpoint ID and project ID from environment variables
const endpointId = process.env.VERTEX_AI_ENDPOINT_ID;
const projectId = process.env.VERTEX_AI_PROJECT_ID;
const location = 'us-central1'; // Or whatever region your endpoint is in

async function callVertexAI(data: any) {
  if (!endpointId || !projectId) {
    throw new Error('Vertex AI Endpoint ID or Project ID not found in environment variables.');
  }
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;

  const accessToken = await getAccessToken(); // Implement this function
  if (!accessToken) {
    throw new Error('Failed to obtain access token.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      instances: [data], // Wrap the data in an array
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vertex AI call failed: ${response.status} - ${error}`);
  }

  const result = await response.json();
  return result;
}

// Helper function to get an access token (using ADC or other method)
async function getAccessToken(): Promise<string | null> {
  try {
    const { GoogleAuth } = require('google-auth-library');
    const auth = new GoogleAuth();
    const client = await auth.getIdTokenClient(endpointId);
    const accessToken = await client.idTokenProvider.fetchIdToken(endpointId);
    return accessToken
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}


export async function POST(request: Request) {
  try {
    const data = await request.json();

    const prediction = await callVertexAI(data);

    return NextResponse.json({ prediction });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
