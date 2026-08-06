// Geohash encoding and spatial math utility

const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function encodeGeohash(lat: number, lng: number, precision: number = 7): string {
  let isEven = true;
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;
  let geohash = '';
  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    if (isEven) {
      const mid = (lngMin + lngMax) / 2;
      if (lng > mid) {
        ch |= (1 << (4 - bit));
        lngMin = mid;
      } else {
        lngMax = mid;
      }
    } else {
      const mid = (latMin + latMax) / 2;
      if (lat > mid) {
        ch |= (1 << (4 - bit));
        latMin = mid;
      } else {
        latMax = mid;
      }
    }
    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}

export function decodeGeohash(geohash: string): { lat: number; lng: number } {
  let isEven = true;
  let latMin = -90, latMax = 90;
  let lngMin = -180, lngMax = 180;

  for (let i = 0; i < geohash.length; i++) {
    const c = geohash[i].toLowerCase();
    const cd = BASE32.indexOf(c);
    if (cd === -1) continue;
    for (let j = 4; j >= 0; j--) {
      const mask = 1 << j;
      if (isEven) {
        const mid = (lngMin + lngMax) / 2;
        if (cd & mask) lngMin = mid;
        else lngMax = mid;
      } else {
        const mid = (latMin + latMax) / 2;
        if (cd & mask) latMin = mid;
        else latMax = mid;
      }
      isEven = !isEven;
    }
  }
  return {
    lat: (latMin + latMax) / 2,
    lng: (lngMin + lngMax) / 2,
  };
}

export function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Common city coordinates map for fast lookup
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Austin, TX': { lat: 30.2672, lng: -97.7431 },
  'San Francisco, CA': { lat: 37.7749, lng: -122.4194 },
  'New York, NY': { lat: 40.7128, lng: -74.0060 },
  'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
  'Seattle, WA': { lat: 47.6062, lng: -122.3321 },
  'Boston, MA': { lat: 42.3601, lng: -71.0589 },
  'Denver, CO': { lat: 39.7392, lng: -104.9903 },
  'Atlanta, GA': { lat: 33.7490, lng: -84.3880 },
  'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
  'Washington, DC': { lat: 38.9072, lng: -77.0369 },
  'Miami, FL': { lat: 25.7617, lng: -80.1918 },
  'Dallas, TX': { lat: 32.7767, lng: -96.7970 },
};

export function getCityCoordsAndGeohash(cityName: string): { lat: number; lng: number; geohash: string } {
  const normalized = cityName.trim();
  const match = Object.keys(CITY_COORDINATES).find(
    (c) => c.toLowerCase() === normalized.toLowerCase() || normalized.toLowerCase().includes(c.split(',')[0].toLowerCase())
  );
  const coords = match ? CITY_COORDINATES[match] : { lat: 30.2672, lng: -97.7431 }; // fallback Austin TX
  const geohash = encodeGeohash(coords.lat, coords.lng, 7);
  return { ...coords, geohash };
}
