import { NextResponse } from 'next/server';
import { getStoreData, addDeletionRequest, updateDeletionRequestStatus } from '@/lib/db';

export async function GET() {
  try {
    const data = getStoreData();
    return NextResponse.json({ success: true, requests: data.deletionRequests });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve deletion requests' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, appName, packageName, requestType, details } = body;

    if (!name || !email || !appName || !packageName || !requestType) {
      return NextResponse.json(
        { success: false, error: 'Please provide name, email, app name, package name, and request type.' },
        { status: 400 }
      );
    }

    const newRequest = addDeletionRequest({
      name,
      email,
      appName,
      packageName,
      requestType,
      details
    });

    return NextResponse.json({
      success: true,
      message: 'Deletion request successfully submitted. We will process your request within 7-14 business days.',
      request: newRequest
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to record deletion request' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Request ID and new status required' }, { status: 400 });
    }

    const updated = updateDeletionRequestStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Request status updated to ${status}` });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update request' }, { status: 500 });
  }
}
