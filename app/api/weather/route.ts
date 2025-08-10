import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');

    if (!city) {
      return NextResponse.json({ error: 'City parameter is required' }, { status: 400 });
    }

    // Call the Cereal.sh weather API
    const weatherResponse = await fetch(
      `https://www.cereal.sh/api/weather?city=${encodeURIComponent(city)}`,
      {
        headers: {
          'User-Agent': 'Dashboard-App/1.0',
        },
      }
    );

    if (!weatherResponse.ok) {
      if (weatherResponse.status === 404) {
        return NextResponse.json({ error: 'City not found' }, { status: 404 });
      }
      throw new Error(`Weather API returned ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' }, 
      { status: 500 }
    );
  }
}