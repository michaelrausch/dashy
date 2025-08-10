import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Check if user is admin (defined in environment variable)
function isAdminUser(userEmail?: string | null): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  return !!adminEmail && userEmail === adminEmail;
}

// GET /api/emails - Fetch all email addresses for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can access emails
    if (!isAdminUser(session.user.email)) {
      return NextResponse.json({ emailAddresses: [] });
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.image || null,
        }
      });
    }

    const emailAddresses = await db.emailAddress.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ emailAddresses });
  } catch (error) {
    console.error('Error fetching email addresses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/emails - Create a new email address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can manage emails
    if (!isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, email, inboxUrl } = await request.json();

    if (!name || !email || !inboxUrl) {
      return NextResponse.json({ error: 'Name, email, and inboxUrl are required' }, { status: 400 });
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.image || null,
        }
      });
    }

    const emailAddress = await db.emailAddress.create({
      data: {
        userId: user.id,
        name,
        email,
        inboxUrl
      }
    });

    return NextResponse.json(emailAddress, { status: 201 });
  } catch (error) {
    console.error('Error creating email address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}