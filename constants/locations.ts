export interface Location {
  id: string;
  name: string;
  country: string;
  description: string;
  seasonStart: number;
  seasonEnd: number;
  timezone: string;
  surfDetails: {
    breaks: string;
    skillLevels: string;
    waterTemp: string;
  };
  travelInfo: string;
}

export const DEFAULT_LOCATIONS: Location[] = [
  {
    id: 'sri-lanka',
    name: 'Sri Lanka — South Coast',
    country: 'Sri Lanka',
    description: 'Warm water, clean Indian Ocean swells, uncrowded beaches along the southern coastline from Weligama to Mirissa. A place to slow down, connect with the ocean, and find presence in the rhythm of the waves.',
    seasonStart: 11,
    seasonEnd: 4,
    timezone: 'Asia/Colombo',
    surfDetails: {
      breaks: 'Weligama Bay (beginner), Mirissa (intermediate), Hikkaduwa (all levels)',
      skillLevels: 'All levels welcome — gentle beach breaks to reef points',
      waterTemp: '27-29°C / 80-84°F year-round',
    },
    travelInfo: 'Fly into Colombo (CMB). 2.5 hour drive south to the coast. Visa on arrival for most nationalities.',
  },
  {
    id: 'lombok',
    name: 'Lombok, Indonesia',
    country: 'Indonesia',
    description: 'Just east of Bali but worlds apart — Lombok offers uncrowded waves, raw natural beauty, and the intimacy that larger islands have lost. Selong Belanak\'s crescent bay is one of the most beginner-friendly surf beaches in Southeast Asia.',
    seasonStart: 4,
    seasonEnd: 10,
    timezone: 'Asia/Makassar',
    surfDetails: {
      breaks: 'Selong Belanak (beginner-friendly), Kuta Lombok reefs (intermediate), Gerupuk (all levels)',
      skillLevels: 'Perfect for beginners through intermediate',
      waterTemp: '27-30°C / 80-86°F',
    },
    travelInfo: 'Fly into Lombok International Airport (LOP). 45 min drive to South Lombok. Visa free for 30 days for most nationalities.',
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica — Pacific Coast',
    country: 'Costa Rica',
    description: 'The Pacific coast from Nosara to Santa Teresa is where surf culture meets wellness. Consistent waves, warm water, offshore morning winds, and a vibrant community of people drawn to a simpler, more intentional way of living.',
    seasonStart: 12,
    seasonEnd: 4,
    timezone: 'America/Costa_Rica',
    surfDetails: {
      breaks: 'Playa Guiones in Nosara (all levels), Santa Teresa (intermediate+), Playa Carmen (beginner)',
      skillLevels: 'All levels — beach breaks with something for everyone',
      waterTemp: '26-29°C / 78-84°F',
    },
    travelInfo: 'Fly into Liberia (LIR) or San José (SJO). 2-4 hour drive depending on destination. No visa needed for most nationalities.',
  },
];
