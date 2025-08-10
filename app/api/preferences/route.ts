import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user
    let user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
        include: { preferences: true }
      });
    }

    // Get or create preferences
    let preferences = user.preferences;
    const hasSetPreferences = !!preferences;
    
    if (!preferences) {
      preferences = await db.userPreferences.create({
        data: {
          userId: user.id,
          enabledLinks: []
        }
      });
    }

    return NextResponse.json({
      enabledLinks: preferences.enabledLinks,
      city: preferences.city,
      displayName: preferences.displayName,
      hasSetPreferences
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabledLinks, city, displayName } = await request.json();

    // Get or create user
    let user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
        include: { preferences: true }
      });
    }

    // Update or create preferences
    const preferences = await db.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        enabledLinks,
        city,
        displayName
      },
      create: {
        userId: user.id,
        enabledLinks,
        city,
        displayName
      }
    });

    return NextResponse.json({
      enabledLinks: preferences.enabledLinks,
      city: preferences.city,
      displayName: preferences.displayName,
      hasSetPreferences: true
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}