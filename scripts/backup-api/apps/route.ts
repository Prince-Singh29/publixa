import { NextResponse } from 'next/server';
import { getAllApps, saveApp } from '@/lib/db';

export async function GET() {
  try {
    const apps = getAllApps();
    return NextResponse.json({ success: true, apps });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch apps' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.packageName) {
      return NextResponse.json({ success: false, error: 'App name and package name are required' }, { status: 400 });
    }

    const savedApp = saveApp(body);
    return NextResponse.json({ success: true, app: savedApp });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save app' }, { status: 500 });
  }
}
