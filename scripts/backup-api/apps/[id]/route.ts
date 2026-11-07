import { NextResponse } from 'next/server';
import { getAppBySlug, deleteApp, saveApp } from '@/lib/db';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const app = getAppBySlug(id);
    if (!app) {
      return NextResponse.json({ success: false, error: 'App not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, app });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch app' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updated = saveApp({ ...body, id });
    return NextResponse.json({ success: true, app: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update app' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const success = deleteApp(id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'App not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'App deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete app' }, { status: 500 });
  }
}
