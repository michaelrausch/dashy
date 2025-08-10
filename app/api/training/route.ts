import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { TrainingDay, TrainingWeek, TrainingActivity } from '@/types';

const mapTrainingDaysToWeek = (trainingDays: TrainingDay[]): TrainingWeek => {
  let week: TrainingWeek = {
    "monday": "rest",
    "tuesday": "rest",
    "wednesday": "rest",
    "thursday": "rest",
    "friday": "rest",
    "saturday": "rest",
    "sunday": "rest"
  };

  trainingDays.forEach((day) => {
    week[day.dayOfWeek as keyof TrainingWeek] = day.activity;
  });

  return week;
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and training days
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { trainingDays: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { week } = await request.json();

    // Validate week
    if (!week) {
      return NextResponse.json({ error: 'Week is required' }, { status: 400 });
    }
    if (Object.keys(week).length !== 7) {
      return NextResponse.json({ error: 'Week must have 7 days' }, { status: 400 });
    }

    // Update training days using the new composite unique constraint
    for (const [dayOfWeek, activity] of Object.entries(week)) {
      await db.trainingDay.upsert({
        where: {
          userId_dayOfWeek: {
            userId: user.id,
            dayOfWeek
          }
        },
        update: {
          activity: activity as string
        },
        create: {
          userId: user.id,
          dayOfWeek,
          activity: activity as string
        }
      });
    }

    // Return the updated week
    const updatedTrainingDays = await db.trainingDay.findMany({
      where: { userId: user.id }
    });

    const updatedWeek = mapTrainingDaysToWeek(updatedTrainingDays.map((day: any) => ({
      dayOfWeek: day.dayOfWeek,
      activity: day.activity as TrainingActivity
    })));
    return NextResponse.json(updatedWeek);

  } catch (error) {
    console.error('Error updating training days:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and training days
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { trainingDays: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(mapTrainingDaysToWeek(user.trainingDays.map((day: any) => ({
      dayOfWeek: day.dayOfWeek,
      activity: day.activity as TrainingActivity
    }))));
  } catch (error) {
    console.error('Error fetching training days:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}