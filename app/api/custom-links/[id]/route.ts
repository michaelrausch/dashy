import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, url, icon, color, gradient } = await request.json();
    const { id: linkId } = await params;

    // Validate required fields
    if (!title || !url || !icon) {
      return NextResponse.json({ error: 'Title, URL, and icon are required' }, { status: 400 });
    }

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update custom link (only if it belongs to the user)
    const customLink = await db.customLink.updateMany({
      where: { 
        id: linkId,
        userId: user.id
      },
      data: {
        title,
        url,
        icon,
        color: color || "from-gray-500 to-gray-600",
        gradient: gradient || "bg-gradient-to-br from-gray-500 to-gray-600"
      }
    });

    if (customLink.count === 0) {
      return NextResponse.json({ error: 'Custom link not found' }, { status: 404 });
    }

    // Return the updated link
    const updatedLink = await db.customLink.findUnique({
      where: { id: linkId }
    });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error('Error updating custom link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: linkId } = await params;

    // Get user
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete custom link (only if it belongs to the user)
    const deletedLink = await db.customLink.deleteMany({
      where: { 
        id: linkId,
        userId: user.id
      }
    });

    if (deletedLink.count === 0) {
      return NextResponse.json({ error: 'Custom link not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Custom link deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}