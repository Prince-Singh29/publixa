import { NextResponse } from 'next/server';
import { getStoreData, addSupportMessage, updateSupportMessageStatus } from '@/lib/db';

export async function GET() {
  try {
    const data = getStoreData();
    return NextResponse.json({ success: true, messages: data.supportMessages });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, appName, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Please provide name, email, subject, and message.' },
        { status: 400 }
      );
    }

    const newMsg = addSupportMessage({
      name,
      email,
      subject,
      appName: appName || 'General Inquiry',
      message
    });

    return NextResponse.json({
      success: true,
      message: 'Support request received. A Publixa team member will review and respond to your email.',
      data: newMsg
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save support message' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Message ID and new status required' }, { status: 400 });
    }

    const updated = updateSupportMessageStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Status updated to ${status}` });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 });
  }
}
