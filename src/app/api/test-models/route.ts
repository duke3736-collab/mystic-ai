import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const key = process.env.GEMINI_API_KEY || '';
    let url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const allModels = [];
    
    while (url) {
      const res = await fetch(url);
      const data = await res.json();
      if (data.models) {
        allModels.push(...data.models.map((m: any) => m.name));
      }
      if (data.nextPageToken) {
        url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}&pageToken=${data.nextPageToken}`;
      } else {
        url = '';
      }
    }
    return NextResponse.json({ models: allModels });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
