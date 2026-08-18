import { MUMBAI_TRANSIT_STATIONS } from '../data/mumbaiStationsData';
// Geocoding and Mumbai Location Search Helper Service

export interface LocationSearchResult {
  id: string;
  displayName: string;
  areaName?: string;
  lat: number;
  lng: number;
  type: 'pandal' | 'landmark' | 'address' | 'station';
  pandalId?: string;
}

// Built-in dictionary of iconic Mumbai areas, hubs, landmarks, and railway stations
// Guarantees instant offline/fast location results for common search terms

const STATION_KEYWORDS: Record<string, string[]> = {
  'Panvel Railway Station': ['panvel station', 'panvel railway', 'panvel railway station', 'pvl', 'pnvl'],
  'Juinagar Railway Station': ['juinagar station', 'juinagar railway'],
  'Kharghar Railway Station': ['kharghar station', 'kharghar railway'],
  'Vashi Railway Station': ['vashi station', 'vashi railway'],
  'Turbhe Railway Station': ['turbhe station', 'turbhe railway'],
  'Sanpada Railway Station': ['sanpada station', 'sanpada railway'],
  'Kopar Khairane Railway Station': ['kopar khairane station', 'koparkhairane station', 'kopar railway'],
  'Ghansoli Railway Station': ['ghansoli station', 'ghansoli railway'],
  'Airoli Railway Station': ['airoli station', 'airoli railway'],
};

export const MUMBAI_LANDMARKS: { name: string; area: string; lat: number; lng: number; keywords: string[] }[] = [
  { name: 'Lalbaug, Parel', area: 'Lalbaug', lat: 18.9912, lng: 72.8385, keywords: ['lalbaug', 'parel', 'currey road', 'chinchpokli', 'lalbaugcha raja'] },
  { name: 'Chinchpokli Station & Area', area: 'Chinchpokli', lat: 18.9856, lng: 72.8340, keywords: ['chinchpokli', 'chintamani', 'dattaram lad'] },
  { name: 'Sion & King\'s Circle', area: 'Sion', lat: 19.0328, lng: 72.8596, keywords: ['sion', 'kings circle', 'gsb', 'sion circle', 'matunga'] },
  { name: 'Khetwadi Lane 1-14', area: 'Khetwadi', lat: 18.9568, lng: 72.8228, keywords: ['khetwadi', 'grant road', 'girgaon', 'khetwadi cha raja'] },
  { name: 'Andheri West & Lokhandwala', area: 'Andheri', lat: 19.1197, lng: 72.8464, keywords: ['andheri', 'lokhandwala', 'andhericha raja', 'versova', 'azad nagar'] },
  { name: 'Andheri East & MIDC', area: 'Andheri', lat: 19.1136, lng: 72.8697, keywords: ['andheri east', 'chakala', 'midc', 'marol', 'jb nagar'] },
  { name: 'Girgaon Chowpatty & Opera House', area: 'Girgaon', lat: 18.9543, lng: 72.8143, keywords: ['girgaon', 'chowpatty', 'opera house', 'charni road', 'girgaon cha raja'] },
  { name: 'Dadar West & Shivaji Park', area: 'Dadar', lat: 19.0178, lng: 72.8478, keywords: ['dadar', 'shivaji park', 'plaza cinema', 'ranade road', 'dadar west'] },
  { name: 'Dadar East & TT Circle', area: 'Dadar', lat: 19.0185, lng: 72.8430, keywords: ['dadar east', 'tt circle', 'hindmata', 'parijat'] },
  { name: 'Bandra West & Bandstand', area: 'Bandra', lat: 19.0596, lng: 72.8295, keywords: ['bandra', 'bandstand', 'carter road', 'linking road', 'bandra west', 'hill road'] },
  { name: 'Bandra Kurla Complex (BKC)', area: 'Bandra', lat: 19.0657, lng: 72.8686, keywords: ['bkc', 'bandra kurla complex', 'mumbai cricket association'] },
  { name: 'Juhu Beach & Vile Parle', area: 'Juhu', lat: 19.1075, lng: 72.8263, keywords: ['juhu', 'juhu beach', 'vile parle', 'iskcon juhu'] },
  { name: 'Lower Parel & Phoenix Mills', area: 'Lower Parel', lat: 19.0000, lng: 72.8282, keywords: ['lower parel', 'phoenix', 'high street phoenix', 'currey road'] },
  { name: 'Prabhadevi & Siddhivinayak Temple', area: 'Prabhadevi', lat: 19.0168, lng: 72.8302, keywords: ['prabhadevi', 'siddhivinayak', 'siddhivinayak temple', 'century bazaar'] },
  { name: 'Worli Sea Face & Naka', area: 'Worli', lat: 19.0110, lng: 72.8170, keywords: ['worli', 'worli sea face', 'worli naka', 'neelam nagar'] },
  { name: 'Colaba & Gateway of India', area: 'Colaba', lat: 18.9220, lng: 72.8347, keywords: ['colaba', 'gateway of india', 'taj hotel', 'causeway', 'fort'] },
  { name: 'Fort & Chhatrapati Shivaji Terminus (CSMT)', area: 'Fort', lat: 18.9400, lng: 72.8350, keywords: ['fort', 'csmt', 'cst', 'horniman circle', 'ballard estate'] },
  { name: 'Marine Drive & Churchgate', area: 'Churchgate', lat: 18.9322, lng: 72.8264, keywords: ['marine drive', 'churchgate', 'nariman point', 'wankhede'] },
  { name: 'Borivali West & Gorai', area: 'Borivali', lat: 19.2307, lng: 72.8567, keywords: ['borivali', 'gorai', 'shimpoli', 'ic colony', 'borivali west'] },
  { name: 'Kandivali East & West', area: 'Kandivali', lat: 19.2045, lng: 72.8522, keywords: ['kandivali', 'lokhandwala kandivali', 'mahavir nagar'] },
  { name: 'Malad West & Mindspace', area: 'Malad', lat: 19.1860, lng: 72.8485, keywords: ['malad', 'mindspace', 'inorbit', 'evershine nagar'] },
  { name: 'Goregaon West & East', area: 'Goregaon', lat: 19.1663, lng: 72.8526, keywords: ['goregaon', 'aarey', 'oberoi mall', 'film city'] },
  { name: 'Kurla West & Phoenix Marketcity', area: 'Kurla', lat: 19.0626, lng: 72.8826, keywords: ['kurla', 'phoenix marketcity', 'kurla west', 'lbs marg'] },
  { name: 'Ghatkopar East & West', area: 'Ghatkopar', lat: 19.0860, lng: 72.9081, keywords: ['ghatkopar', 'r-city mall', 'pant nagar', 'garodia nagar'] },
  { name: 'Chembur & Diamond Garden', area: 'Chembur', lat: 19.0600, lng: 72.8900, keywords: ['chembur', 'diamond garden', 'rk studio', 'chembur naka'] },
  { name: 'Thane West & Viviana Mall', area: 'Thane', lat: 19.2183, lng: 72.9781, keywords: ['thane', 'viviana mall', 'machiwala', 'majiwada', 'thane station'] },
  { name: 'Vashi & Navi Mumbai', area: 'Navi Mumbai', lat: 19.0771, lng: 72.9986, keywords: ['vashi', 'navi mumbai', 'inorbit vashi', 'palm beach'] },
  { name: 'Mulund West & LBS Marg', area: 'Mulund', lat: 19.1726, lng: 72.9565, keywords: ['mulund', 'mulund west', 'check naka'] },
];

/**
 * Searches locations matching a query using:
 * 1) Local Mumbai Dictionary
 * 2) OpenStreetMap Nominatim Geocoding API (for any street, address, landmark in Mumbai / India)
 */
export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const results: LocationSearchResult[] = [];

  // 1. Search railway/metro stations first. This fixes queries such as
  // "Panvel station" even when the external geocoder biases the search toward Mumbai.
  MUMBAI_TRANSIT_STATIONS.forEach((station) => {
    const stationKeywords = [
      station.name.toLowerCase(),
      station.name.replace(/ railway station| station| & metro junction| & metro hub/gi, '').toLowerCase(),
      ...(STATION_KEYWORDS[station.name] || []),
    ];
    if (stationKeywords.some((k) => k.includes(trimmed) || trimmed.includes(k))) {
      results.push({
        id: station.id,
        displayName: station.name,
        areaName: station.zone,
        lat: station.latitude,
        lng: station.longitude,
        type: 'station',
      });
    }
  });

  // 2. Search Local Mumbai Dictionary
  MUMBAI_LANDMARKS.forEach((lm, index) => {
    const matchesName = lm.name.toLowerCase().includes(trimmed);
    const matchesArea = lm.area.toLowerCase().includes(trimmed);
    const matchesKeyword = lm.keywords.some((k) => k.includes(trimmed) || trimmed.includes(k));

    if (matchesName || matchesArea || matchesKeyword) {
      results.push({
        id: `landmark-${index}`,
        displayName: lm.name,
        areaName: lm.area,
        lat: lm.lat,
        lng: lm.lng,
        type: 'landmark',
      });
    }
  });

  // 3. Fetch from OpenStreetMap Nominatim API if query is at least 3 chars
  if (trimmed.length >= 3) {
    try {
      const isNaviMumbaiOrPanvel = /panvel|kharghar|vashi|turbhe|sanpada|juinagar|airoli|ghansoli|kopar|navi mumbai|belapur/i.test(trimmed);
      const searchQuery =
        trimmed.includes('mumbai') || trimmed.includes('maharashtra') || isNaviMumbaiOrPanvel
          ? `${trimmed}, Maharashtra, India`
          : `${trimmed}, Mumbai, Maharashtra, India`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&countrycodes=in&limit=6`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        data.forEach((item: any, idx: number) => {
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);

          // Ensure it's inside reasonable boundaries or valid coordinates
          if (!isNaN(lat) && !isNaN(lng)) {
            // Avoid duplicate landmarks
            const isDuplicate = results.some(
              (r) => Math.abs(r.lat - lat) < 0.005 && Math.abs(r.lng - lng) < 0.005
            );

            if (!isDuplicate) {
              // Format cleaner name
              const cleanName = item.display_name
                .split(',')
                .slice(0, 3)
                .join(',')
                .trim();

              results.push({
                id: `nominatim-${idx}-${Date.now()}`,
                displayName: cleanName || item.display_name,
                lat,
                lng,
                type: 'address',
              });
            }
          }
        });
      }
    } catch (err) {
      console.warn('Nominatim location fetch error:', err);
    }
  }

  return results;
}
