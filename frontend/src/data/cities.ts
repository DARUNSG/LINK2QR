export interface CityItem {
  id: string;
  city: string;
  country: string;
  flag: string;
  timezone: string;
  continent: string;
  standardOffset: string;
}

export const WORLD_CITIES: CityItem[] = [
  // Asia
  { id: 'in-chennai', city: 'Chennai', country: 'India', flag: '🇮🇳', timezone: 'Asia/Kolkata', continent: 'Asia', standardOffset: 'UTC+05:30' },
  { id: 'in-mumbai', city: 'Mumbai', country: 'India', flag: '🇮🇳', timezone: 'Asia/Kolkata', continent: 'Asia', standardOffset: 'UTC+05:30' },
  { id: 'in-delhi', city: 'Delhi', country: 'India', flag: '🇮🇳', timezone: 'Asia/Kolkata', continent: 'Asia', standardOffset: 'UTC+05:30' },
  { id: 'in-bengaluru', city: 'Bengaluru', country: 'India', flag: '🇮🇳', timezone: 'Asia/Kolkata', continent: 'Asia', standardOffset: 'UTC+05:30' },
  { id: 'jp-tokyo', city: 'Tokyo', country: 'Japan', flag: '🇯🇵', timezone: 'Asia/Tokyo', continent: 'Asia', standardOffset: 'UTC+09:00' },
  { id: 'sg-singapore', city: 'Singapore', country: 'Singapore', flag: '🇸🇬', timezone: 'Asia/Singapore', continent: 'Asia', standardOffset: 'UTC+08:00' },
  { id: 'hk-hongkong', city: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰', timezone: 'Asia/Hong_Kong', continent: 'Asia', standardOffset: 'UTC+08:00' },
  { id: 'cn-shanghai', city: 'Shanghai', country: 'China', flag: '🇨🇳', timezone: 'Asia/Shanghai', continent: 'Asia', standardOffset: 'UTC+08:00' },
  { id: 'cn-beijing', city: 'Beijing', country: 'China', flag: '🇨🇳', timezone: 'Asia/Shanghai', continent: 'Asia', standardOffset: 'UTC+08:00' },
  { id: 'kr-seoul', city: 'Seoul', country: 'South Korea', flag: '🇰🇷', timezone: 'Asia/Seoul', continent: 'Asia', standardOffset: 'UTC+09:00' },
  { id: 'th-bangkok', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭', timezone: 'Asia/Bangkok', continent: 'Asia', standardOffset: 'UTC+07:00' },
  { id: 'ae-dubai', city: 'Dubai', country: 'UAE', flag: '🇦🇪', timezone: 'Asia/Dubai', continent: 'Asia', standardOffset: 'UTC+04:00' },
  { id: 'sa-riyadh', city: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦', timezone: 'Asia/Riyadh', continent: 'Asia', standardOffset: 'UTC+03:00' },
  { id: 'np-kathmandu', city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵', timezone: 'Asia/Kathmandu', continent: 'Asia', standardOffset: 'UTC+05:45' },
  { id: 'bd-dhaka', city: 'Dhaka', country: 'Bangladesh', flag: '🇧🇩', timezone: 'Asia/Dhaka', continent: 'Asia', standardOffset: 'UTC+06:00' },
  { id: 'pk-karachi', city: 'Karachi', country: 'Pakistan', flag: '🇵🇰', timezone: 'Asia/Karachi', continent: 'Asia', standardOffset: 'UTC+05:00' },
  { id: 'id-jakarta', city: 'Jakarta', country: 'Indonesia', flag: '🇮🇩', timezone: 'Asia/Jakarta', continent: 'Asia', standardOffset: 'UTC+07:00' },
  { id: 'ph-manila', city: 'Manila', country: 'Philippines', flag: '🇵🇭', timezone: 'Asia/Manila', continent: 'Asia', standardOffset: 'UTC+08:00' },
  { id: 'vn-hanoi', city: 'Hanoi', country: 'Vietnam', flag: '🇻🇳', timezone: 'Asia/Bangkok', continent: 'Asia', standardOffset: 'UTC+07:00' },

  // Europe
  { id: 'uk-london', city: 'London', country: 'United Kingdom', flag: '🇬🇧', timezone: 'Europe/London', continent: 'Europe', standardOffset: 'UTC+00:00' },
  { id: 'fr-paris', city: 'Paris', country: 'France', flag: '🇫🇷', timezone: 'Europe/Paris', continent: 'Europe', standardOffset: 'UTC+01:00' },
  { id: 'de-berlin', city: 'Berlin', country: 'Germany', flag: '🇩🇪', timezone: 'Europe/Berlin', continent: 'Europe', standardOffset: 'UTC+01:00' },
  { id: 'ch-zurich', city: 'Zurich', country: 'Switzerland', flag: '🇨🇭', timezone: 'Europe/Zurich', continent: 'Europe', standardOffset: 'UTC+01:00' },
  { id: 'nl-amsterdam', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱', timezone: 'Europe/Amsterdam', continent: 'Europe', standardOffset: 'UTC+01:00' },
  { id: 'it-rome', city: 'Rome', country: 'Italy', flag: '🇮🇹', timezone: 'Europe/Rome', continent: 'Europe', standardOffset: 'UTC+01:00' },
  { id: 'es-madrid', city: 'Madrid', country: 'Spain', flag: '🇪🇸', timezone: 'Europe/Madrid', continent: 'Europe', standardOffset: 'UTC+01:00' },
  { id: 'se-stockholm', city: 'Stockholm', country: 'Sweden', flag: '🇸🇪', timezone: 'Europe/Stockholm', continent: 'Europe', standardOffset: 'UTC+01:00' },
  { id: 'gr-athens', city: 'Athens', country: 'Greece', flag: '🇬🇷', timezone: 'Europe/Athens', continent: 'Europe', standardOffset: 'UTC+02:00' },
  { id: 'tr-istanbul', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷', timezone: 'Europe/Istanbul', continent: 'Europe', standardOffset: 'UTC+03:00' },
  { id: 'ie-dublin', city: 'Dublin', country: 'Ireland', flag: '🇮🇪', timezone: 'Europe/Dublin', continent: 'Europe', standardOffset: 'UTC+00:00' },
  { id: 'pt-lisbon', city: 'Lisbon', country: 'Portugal', flag: '🇵🇹', timezone: 'Europe/Lisbon', continent: 'Europe', standardOffset: 'UTC+00:00' },
  { id: 'pl-warsaw', city: 'Warsaw', country: 'Poland', flag: '🇵🇱', timezone: 'Europe/Warsaw', continent: 'Europe', standardOffset: 'UTC+01:00' },
  { id: 'ua-kyiv', city: 'Kyiv', country: 'Ukraine', flag: '🇺🇦', timezone: 'Europe/Kyiv', continent: 'Europe', standardOffset: 'UTC+02:00' },

  // Americas
  { id: 'us-ny', city: 'New York', country: 'USA', flag: '🇺🇸', timezone: 'America/New_York', continent: 'Americas', standardOffset: 'UTC-05:00' },
  { id: 'us-la', city: 'Los Angeles', country: 'USA', flag: '🇺🇸', timezone: 'America/Los_Angeles', continent: 'Americas', standardOffset: 'UTC-08:00' },
  { id: 'us-chicago', city: 'Chicago', country: 'USA', flag: '🇺🇸', timezone: 'America/Chicago', continent: 'Americas', standardOffset: 'UTC-06:00' },
  { id: 'us-sf', city: 'San Francisco', country: 'USA', flag: '🇺🇸', timezone: 'America/Los_Angeles', continent: 'Americas', standardOffset: 'UTC-08:00' },
  { id: 'us-miami', city: 'Miami', country: 'USA', flag: '🇺🇸', timezone: 'America/New_York', continent: 'Americas', standardOffset: 'UTC-05:00' },
  { id: 'us-denver', city: 'Denver', country: 'USA', flag: '🇺🇸', timezone: 'America/Denver', continent: 'Americas', standardOffset: 'UTC-07:00' },
  { id: 'ca-toronto', city: 'Toronto', country: 'Canada', flag: '🇨🇦', timezone: 'America/Toronto', continent: 'Americas', standardOffset: 'UTC-05:00' },
  { id: 'ca-vancouver', city: 'Vancouver', country: 'Canada', flag: '🇨🇦', timezone: 'America/Vancouver', continent: 'Americas', standardOffset: 'UTC-08:00' },
  { id: 'ca-stjohns', city: "St. John's", country: 'Canada', flag: '🇨🇦', timezone: 'America/St_Johns', continent: 'Americas', standardOffset: 'UTC-03:30' },
  { id: 'mx-mexico', city: 'Mexico City', country: 'Mexico', flag: '🇲🇽', timezone: 'America/Mexico_City', continent: 'Americas', standardOffset: 'UTC-06:00' },
  { id: 'br-saopaulo', city: 'São Paulo', country: 'Brazil', flag: '🇧🇷', timezone: 'America/Sao_Paulo', continent: 'Americas', standardOffset: 'UTC-03:00' },
  { id: 'ar-buenosaires', city: 'Buenos Aires', country: 'Argentina', flag: '🇦🇷', timezone: 'America/Argentina/Buenos_Aires', continent: 'Americas', standardOffset: 'UTC-03:00' },
  { id: 'cl-santiago', city: 'Santiago', country: 'Chile', flag: '🇨🇱', timezone: 'America/Santiago', continent: 'Americas', standardOffset: 'UTC-04:00' },
  { id: 'co-bogota', city: 'Bogotá', country: 'Colombia', flag: '🇨🇴', timezone: 'America/Bogota', continent: 'Americas', standardOffset: 'UTC-05:00' },

  // Australia & Pacific
  { id: 'au-sydney', city: 'Sydney', country: 'Australia', flag: '🇦🇺', timezone: 'Australia/Sydney', continent: 'Australia/Pacific', standardOffset: 'UTC+10:00' },
  { id: 'au-melbourne', city: 'Melbourne', country: 'Australia', flag: '🇦🇺', timezone: 'Australia/Melbourne', continent: 'Australia/Pacific', standardOffset: 'UTC+10:00' },
  { id: 'au-adelaide', city: 'Adelaide', country: 'Australia', flag: '🇦🇺', timezone: 'Australia/Adelaide', continent: 'Australia/Pacific', standardOffset: 'UTC+09:30' },
  { id: 'au-perth', city: 'Perth', country: 'Australia', flag: '🇦🇺', timezone: 'Australia/Perth', continent: 'Australia/Pacific', standardOffset: 'UTC+08:00' },
  { id: 'nz-auckland', city: 'Auckland', country: 'New Zealand', flag: '🇳🇿', timezone: 'Pacific/Auckland', continent: 'Australia/Pacific', standardOffset: 'UTC+12:00' },
  { id: 'us-honolulu', city: 'Honolulu', country: 'USA (Hawaii)', flag: '🇺🇸', timezone: 'Pacific/Honolulu', continent: 'Australia/Pacific', standardOffset: 'UTC-10:00' },

  // Africa & Middle East
  { id: 'eg-cairo', city: 'Cairo', country: 'Egypt', flag: '🇪🇬', timezone: 'Africa/Cairo', continent: 'Africa', standardOffset: 'UTC+02:00' },
  { id: 'za-johannesburg', city: 'Johannesburg', country: 'South Africa', flag: '🇿🇦', timezone: 'Africa/Johannesburg', continent: 'Africa', standardOffset: 'UTC+02:00' },
  { id: 'ng-lagos', city: 'Lagos', country: 'Nigeria', flag: '🇳🇬', timezone: 'Africa/Lagos', continent: 'Africa', standardOffset: 'UTC+01:00' },
  { id: 'ke-nairobi', city: 'Nairobi', country: 'Kenya', flag: '🇰🇪', timezone: 'Africa/Nairobi', continent: 'Africa', standardOffset: 'UTC+03:00' },
  { id: 'ma-casablanca', city: 'Casablanca', country: 'Morocco', flag: '🇲🇦', timezone: 'Africa/Casablanca', continent: 'Africa', standardOffset: 'UTC+01:00' }
];

export const getCityByTimezoneOrName = (search: string): CityItem | undefined => {
  const query = search.toLowerCase();
  return WORLD_CITIES.find(c => 
    c.city.toLowerCase() === query ||
    c.timezone.toLowerCase() === query ||
    c.country.toLowerCase() === query
  );
};
