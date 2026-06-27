import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);
  const url = params.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL is required' },
      { status: 400 }
    );
  }

  // Call Rust backend
  try {
    const backendResponse = await fetch('http://localhost:3001/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ url }),
    });

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Backend service unavailable' },
      { status: 503 }
    );
  }
}
