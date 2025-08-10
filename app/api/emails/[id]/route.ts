import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Check if user is admin (defined in environment variable)
function isAdminUser(userEmail?: string | null): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!adminEmail && userEmail === adminEmail;
}

// GET /api/emails/[id] - Get a specific email address
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can access emails
    if (!isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: emailId } = await params;

    const emailAddress = await db.emailAddress.findUnique({
      where: { id: emailId },
      include: { user: true }
    });

    if (!emailAddress) {
      return NextResponse.json({ error: 'Email address not found' }, { status: 404 });
    }

    // Ensure the email belongs to the current user
    if (emailAddress.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(emailAddress);
  } catch (error) {
    console.error('Error fetching email address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/emails/[id] - Update a specific email address
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can manage emails
    if (!isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: emailId } = await params;
    const { name, email, inboxUrl } = await request.json();

    // Verify the email belongs to the current user
    const existingEmail = await db.emailAddress.findUnique({
      where: { id: emailId },
      include: { user: true }
    });

    if (!existingEmail) {
      return NextResponse.json({ error: 'Email address not found' }, { status: 404 });
    }

    if (existingEmail.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const emailAddress = await db.emailAddress.update({
      where: { id: emailId },
      data: {
        name: name || existingEmail.name,
        email: email || existingEmail.email,
        inboxUrl: inboxUrl || existingEmail.inboxUrl
      }
    });

    return NextResponse.json(emailAddress);
  } catch (error) {
    console.error('Error updating email address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/emails/[id] - Delete a specific email address
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can manage emails
    if (!isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id: emailId } = await params;

    // Verify the email belongs to the current user
    const existingEmail = await db.emailAddress.findUnique({
      where: { id: emailId },
      include: { user: true }
    });

    if (!existingEmail) {
      return NextResponse.json({ error: 'Email address not found' }, { status: 404 });
    }

    if (existingEmail.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.emailAddress.delete({
      where: { id: emailId }
    });

    return NextResponse.json({ message: 'Email address deleted successfully' });
  } catch (error) {
    console.error('Error deleting email address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}