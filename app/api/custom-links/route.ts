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

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { customLinks: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user.customLinks);
  } catch (error) {
    console.error('Error fetching custom links:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, url, icon, color, gradient } = await request.json();

    // Validate required fields
    if (!title || !url || !icon) {
      return NextResponse.json({ error: 'Title, URL, and icon are required' }, { status: 400 });
    }

    // Get or create user
    let user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }
      });
    }

    // Create custom link
    const customLink = await db.customLink.create({
      data: {
        userId: user.id,
        title,
        url,
        icon,
        color: color || "from-gray-500 to-gray-600",
        gradient: gradient || "bg-gradient-to-br from-gray-500 to-gray-600"
      }
    });

    return NextResponse.json(customLink);
  } catch (error) {
    console.error('Error creating custom link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}