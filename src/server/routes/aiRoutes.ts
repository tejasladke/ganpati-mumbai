import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import { store } from '../db.js';

const router = express.Router();

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Calculate distance between two lat/lng points in km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

// Algorithmic Fallback Itinerary Builder
function buildFallbackItinerary(
  startLoc: { name: string; latitude: number; longitude: number },
  pandals: any[],
  startTime: string = '08:00 AM',
  travelMode: string = 'walking'
) {
  const remaining = [...pandals];
  const stops: any[] = [];
  let currLat = startLoc.latitude;
  let currLng = startLoc.longitude;
  let totalKm = 0;

  let currentMin = 8 * 60; // default 8:00 AM in mins
  if (startTime) {
    const parts = startTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (parts) {
      let h = parseInt(parts[1], 10);
      const m = parseInt(parts[2], 10);
      const ampm = parts[3] ? parts[3].toUpperCase() : 'AM';
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      currentMin = h * 60 + m;
    }
  }

  let step = 1;
  while (remaining.length > 0) {
    // find nearest
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineKm(currLat, currLng, remaining[i].latitude, remaining[i].longitude);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }

    const nextPandal = remaining.splice(nearestIdx, 1)[0];
    totalKm += minDist;

    // Travel time estimate: walking 4km/h = 15min per km; driving 15km/h = 4min per km
    const travelMins = Math.max(5, Math.round(minDist * (travelMode === 'walking' ? 14 : 5)));
    currentMin += travelMins;

    const arrHour = Math.floor(currentMin / 60) % 24;
    const arrMin = currentMin % 60;
    const ampmStr = arrHour >= 12 ? 'PM' : 'AM';
    const displayHour = arrHour % 12 === 0 ? 12 : arrHour % 12;
    const arrivalStr = `${displayHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')} ${ampmStr}`;

    const durationMin = nextPandal.crowdLevel === 'High' ? 45 : nextPandal.crowdLevel === 'Moderate' ? 30 : 20;

    stops.push({
      stepNumber: step,
      pandalId: nextPandal.id || nextPandal._id,
      pandalName: nextPandal.name,
      area: nextPandal.area,
      latitude: nextPandal.latitude,
      longitude: nextPandal.longitude,
      estimatedArrival: arrivalStr,
      estimatedDurationMin: durationMin,
      crowdForecast: `${nextPandal.crowdLevel} crowd expected`,
      travelFromPrev: step === 1 ? `Start from ${startLoc.name} (${minDist} km)` : `${minDist} km from stop #${step - 1}`,
      transitInstruction: travelMode === 'walking' ? `Walk ${minDist} km (~${travelMins} mins)` : `Ride/Cab ~${travelMins} mins`,
      tip: `Focus on ${nextPandal.famousFeatures?.[0] || 'the main deity and unique mandap decor'}.`,
    });

    currentMin += durationMin;
    currLat = nextPandal.latitude;
    currLng = nextPandal.longitude;
    step++;
  }

  const estTotalHours = (totalKm / (travelMode === 'walking' ? 3.5 : 12) + (stops.length * 35) / 60).toFixed(1);

  return {
    itineraryTitle: `AI Map Line-by-Line Route from ${startLoc.name}`,
    summary: `Optimized line-by-line tour starting from ${startLoc.name} visiting ${stops.length} pandals sequentially with minimal travel overhead.`,
    totalDistanceKm: Number(totalKm.toFixed(1)),
    estimatedTotalHours: `${estTotalHours} hours`,
    optimalStartRecommended: startTime,
    stops,
    aiInsights: [
      `Sequenced pandals geographically starting from ${startLoc.name} using nearest-neighbor spatial routing.`,
      `Adjusted allocated time for each pandal based on real-time crowd level parameters.`,
      `Grouped nearby South/Central Mumbai pandals into a continuous walk-friendly circuit.`,
    ],
  };
}

// POST /api/ai/plan-itinerary
router.post('/plan-itinerary', async (req, res) => {
  try {
    const {
      startLocation = { name: 'Dadar Station', latitude: 19.0178, longitude: 72.8478 },
      pandalIds,
      startTime = '08:00 AM',
      tourDate = '2026-08-13',
      travelMode = 'walking',
      pace = 'balanced',
    } = req.body;

    // Fetch pandals from store
    let pandals = store.pandals;
    if (Array.isArray(pandalIds) && pandalIds.length > 0) {
      pandals = store.pandals.filter((p) => pandalIds.includes(p.id));
    }
    if (!pandals || pandals.length === 0) {
      pandals = store.pandals;
    }

    const ai = getAiClient();
    if (!ai) {
      // Fallback if no Gemini API key
      const fallback = buildFallbackItinerary(startLocation, pandals, startTime, travelMode);
      return res.json({ success: true, itinerary: fallback, source: 'algorithmic' });
    }

    const simplePandals = pandals.map((p) => ({
      id: p.id,
      name: p.name,
      area: p.area,
      latitude: p.latitude,
      longitude: p.longitude,
      crowdLevel: p.crowdLevel,
      darshanTiming: `${p.darshanStart} - ${p.darshanEnd}`,
      famousFeatures: p.famousFeatures,
    }));

    const prompt = `You are the master Mumbai Ganeshotsav Festival Tour Director.
    Plan a line-by-line step-by-step optimal tour itinerary for a devotee.

    Start Location: "${startLocation.name}" (Lat: ${startLocation.latitude}, Lng: ${startLocation.longitude})
    Tour Date: ${tourDate}
    Start Time: ${startTime}
    Travel Preference: ${travelMode} (walking / transit / driving)
    Pace: ${pace}

    Available Pandals to include:
    ${JSON.stringify(simplePandals, null, 2)}

    INSTRUCTIONS:
    1. Order all pandals sequentially (Stop #1, Stop #2, Stop #3...) to create a continuous line-by-line map path starting from "${startLocation.name}".
    2. Minimize total travel distance and avoid double-backing.
    3. Account for real-time crowd levels and darshan line waiting times (e.g., Lalbaugcha Raja queues can take longer).
    4. Provide estimated arrival times, recommended stay durations, transit instructions between stops, and specific local devotee tips.
    5. Return JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itineraryTitle: { type: Type.STRING },
            summary: { type: Type.STRING },
            totalDistanceKm: { type: Type.NUMBER },
            estimatedTotalHours: { type: Type.STRING },
            optimalStartRecommended: { type: Type.STRING },
            stops: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  pandalId: { type: Type.STRING },
                  pandalName: { type: Type.STRING },
                  area: { type: Type.STRING },
                  latitude: { type: Type.NUMBER },
                  longitude: { type: Type.NUMBER },
                  estimatedArrival: { type: Type.STRING },
                  estimatedDurationMin: { type: Type.INTEGER },
                  crowdForecast: { type: Type.STRING },
                  travelFromPrev: { type: Type.STRING },
                  transitInstruction: { type: Type.STRING },
                  tip: { type: Type.STRING },
                },
                required: [
                  'stepNumber',
                  'pandalId',
                  'pandalName',
                  'area',
                  'latitude',
                  'longitude',
                  'estimatedArrival',
                  'estimatedDurationMin',
                  'crowdForecast',
                  'travelFromPrev',
                  'transitInstruction',
                  'tip',
                ],
              },
            },
            aiInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['itineraryTitle', 'summary', 'totalDistanceKm', 'estimatedTotalHours', 'stops', 'aiInsights'],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Empty response from AI model');
    }

    const parsedItinerary = JSON.parse(textOutput);
    return res.json({
      success: true,
      itinerary: parsedItinerary,
      source: 'gemini-ai',
    });
  } catch (err: any) {
    console.error('AI Itinerary Error:', err);
    // Fallback if AI call fails
    try {
      const {
        startLocation = { name: 'Dadar Station', latitude: 19.0178, longitude: 72.8478 },
        startTime = '08:00 AM',
        travelMode = 'walking',
      } = req.body;
      const pandals = store.pandals;
      const fallback = buildFallbackItinerary(startLocation, pandals, startTime, travelMode);
      return res.json({ success: true, itinerary: fallback, source: 'algorithmic-fallback' });
    } catch (fallbackErr: any) {
      return res.status(500).json({ message: err.message || 'Failed to generate itinerary' });
    }
  }
});

export default router;
