import L from 'leaflet';
import React, { useEffect, useRef } from 'react';
import { AiItinerary, AiItineraryStop } from '../types';

interface AiItineraryMapProps {
  itinerary: AiItinerary;
  startLocation: { name: string; latitude: number; longitude: number };
  onSelectStopPandal?: (pandalId: string) => void;
  className?: string;
}

function createStepMarkerIcon(stepNum: number) {
  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
      <div style="
        background: linear-gradient(135deg, #f97316, #ea580c);
        border: 2px solid #ffffff;
        color: #ffffff;
        font-weight: 900;
        font-size: 14px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(234, 88, 12, 0.4);
        font-family: sans-serif;
      ">
        ${stepNum}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-step-route-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function createStartMarkerIcon() {
  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
      <div style="
        position: absolute;
        width: 38px;
        height: 38px;
        background-color: rgba(59, 130, 246, 0.35);
        border-radius: 50%;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        border: 2px solid #ffffff;
        color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 10px rgba(37, 99, 235, 0.4);
      ">🚩</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-start-route-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

export const AiItineraryMap: React.FC<AiItineraryMapProps> = ({
  itinerary,
  startLocation,
  onSelectStopPandal,
  className = 'h-[400px] w-full rounded-2xl overflow-hidden',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [startLocation.latitude, startLocation.longitude],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const routeLatLngs: L.LatLngTuple[] = [];

    // 1. Add Start Marker
    if (startLocation.latitude && startLocation.longitude) {
      const startCoord: L.LatLngTuple = [startLocation.latitude, startLocation.longitude];
      routeLatLngs.push(startCoord);

      const startMarker = L.marker(startCoord, {
        icon: createStartMarkerIcon(),
      }).addTo(map);

      startMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <span style="background: #2563eb; color: white; text-transform: uppercase; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">Start Location</span>
          <h4 style="margin: 4px 0 2px 0; font-size: 14px; font-weight: 800; color: #1e293b;">${startLocation.name}</h4>
          <p style="margin: 0; font-size: 11px; color: #64748b;">Tour Origin Point</p>
        </div>
      `);
    }

    // 2. Add Stop Markers
    itinerary.stops.forEach((stop: AiItineraryStop) => {
      if (stop.latitude && stop.longitude) {
        const stopCoord: L.LatLngTuple = [stop.latitude, stop.longitude];
        routeLatLngs.push(stopCoord);

        const marker = L.marker(stopCoord, {
          icon: createStepMarkerIcon(stop.stepNumber),
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; padding: 4px; max-width: 220px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="background: #f97316; color: white; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 12px;">
                Stop #${stop.stepNumber}
              </span>
              <span style="font-size: 10px; font-weight: 700; color: #ea580c;">
                ${stop.estimatedArrival}
              </span>
            </div>
            <h4 style="margin: 2px 0; font-size: 14px; font-weight: 800; color: #0f172a;">${stop.pandalName}</h4>
            <p style="margin: 2px 0 6px 0; font-size: 11px; color: #475569;">📍 ${stop.area}</p>
            <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 6px; border-radius: 8px; font-size: 10px; color: #9a3412;">
              <strong>Tip:</strong> ${stop.tip}
            </div>
          </div>
        `);

        if (onSelectStopPandal) {
          marker.on('click', () => {
            onSelectStopPandal(stop.pandalId);
          });
        }
      }
    });

    // 3. Draw Connecting Route Polyline
    if (routeLatLngs.length > 1) {
      L.polyline(routeLatLngs, {
        color: '#f97316',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);

      const bounds = L.latLngBounds(routeLatLngs);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [itinerary, startLocation, onSelectStopPandal]);

  return (
    <div className={`relative border border-amber-200/80 shadow-inner ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-3 bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-amber-400/40 shadow-lg z-[400] flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
        <span>AI Line-By-Line Route Vector</span>
      </div>
    </div>
  );
};
