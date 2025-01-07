import { NextResponse } from 'next/server';
import { generateMeta } from '@/services/generateMeta';

export async function GET() {
  return NextResponse.json(await generateMeta()); // Return the result
}
