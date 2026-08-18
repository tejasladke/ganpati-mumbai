import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { RouteData } from '../services/directions';
import { Pandal } from '../types';
import { MUMBAI_TRANSIT_STATIONS, RailwayStation } from '../data/mumbaiStationsData';

interface LeafletMapProps {
  pandals: Pandal[];
  selectedPandalId?: string;
  onSelectPandal: (pandal: Pandal) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  searchedLocationPin?: {
    lat: number;
    lng: number;
    displayName: string;
  } | null;
  userLocation?: {
    lat: number;
    lng: number;
    displayName?: string;
    accuracyRadius?: number;
  } | null;
  route?: RouteData | null;
  onLocateMe?: () => void;
  isLocating?: boolean;
  showStationsDefault?: boolean;
}

// Function to generate custom SVG Station Marker
function createStationMarkerIcon(line: string) {
  let bgColor = '#78350f'; // Amber/brown
  let badgeLetter = '🚉';

  if (line.includes('Central')) bgColor = '#991b1b'; // Red
  else if (line.includes('Western')) bgColor = '#1e40af'; // Blue
  else if (line.includes('Harbour')) bgColor = '#581c87'; // Purple
  else if (line.includes('Metro')) bgColor = '#065f46'; // Emerald Green

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
      <div style="
        background: ${bgColor};
        border: 2px solid #ffffff;
        color: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      ">${badgeLetter}</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-station-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });
}

// Function to generate custom SVG Ganpati Icon Marker
function createGanpatiIcon(crowdLevel: string, isSelected: boolean) {
  let color = '#3b82f6';
  if (crowdLevel === 'Low') color = '#10b981'; // Green
  else if (crowdLevel === 'Moderate') color = '#f59e0b'; // Amber
  else if (crowdLevel === 'High') color = '#f97316'; // Orange
  else if (crowdLevel === 'Heavy') color = '#e11d48'; // Rose/Red

  const size = isSelected ? 44 : 36;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
      <path filter="url(#shadow)" fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
      <text x="12" y="10.2" font-size="5" font-weight="bold" fill="${color}" text-anchor="middle">🪔</text>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-ganpati-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// Function to create custom Searched Pin Icon
function createSearchPinIcon() {
  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">
      <div style="
        position: absolute;
        width: 38px;
        height: 38px;
        background-color: rgba(2, 132, 199, 0.4);
        border-radius: 50%;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        background: linear-gradient(135deg, #0284c7, #0369a1);
        border: 2px solid #ffffff;
        color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      ">📍</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-searched-location-pin',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
}

// Function to create custom User GPS Location Pin Icon
function createUserLocationIcon() {
  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
      <div style="
        position: absolute;
        width: 38px;
        height: 38px;
        background-color: rgba(14, 165, 233, 0.35);
        border-radius: 50%;
        animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
      <div style="
        position: relative;
        background: #0284c7;
        border: 3px solid #ffffff;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="background: white; width: 8px; height: 8px; border-radius: 50%;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-user-location-pin',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  pandals,
  selectedPandalId,
  onSelectPandal,
  center = [18.9912, 72.8385], // Default Mumbai Lalbaug center
  zoom = 12,
  className = 'h-[500px] w-full rounded-2xl overflow-hidden shadow-inner border border-amber-200',
  searchedLocationPin,
  userLocation,
  route,
  onLocateMe,
  isLocating = false,
  showStationsDefault = true,
}) => {
  const [showStations, setShowStations] = useState<boolean>(showStationsDefault);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const stationsGroupRef = useRef<L.LayerGroup | null>(null);
  const searchPinGroupRef = useRef<L.LayerGroup | null>(null);
  const userLocationGroupRef = useRef<L.LayerGroup | null>(null);
  const routeGroupRef = useRef<L.LayerGroup | null>(null);
  const pandalMarkersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: center as L.LatLngExpression,
        zoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
      stationsGroupRef.current = L.layerGroup().addTo(map);
      searchPinGroupRef.current = L.layerGroup().addTo(map);
      userLocationGroupRef.current = L.layerGroup().addTo(map);
      routeGroupRef.current = L.layerGroup().addTo(map);

      // Trigger size invalidation to fix tile rendering in dynamic layouts
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ResizeObserver for Container Resizing
  useEffect(() => {
    if (!mapRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(mapRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Center update when center prop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (map && center) {
      map.setView(center, zoom);
    }
  }, [center?.[0], center?.[1], zoom]);

  // Handle User Location Pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    const userLocGroup = userLocationGroupRef.current;

    if (!map || !userLocGroup) return;

    userLocGroup.clearLayers();

    if (userLocation) {
      const icon = createUserLocationIcon();
      const marker = L.marker([userLocation.lat, userLocation.lng], {
        icon,
        zIndexOffset: 1200,
      });

      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 150px;">
          <span style="font-size: 10px; font-weight: bold; color: #0284c7; text-transform: uppercase;">🎯 Your Location</span>
          <h4 style="margin: 2px 0 0 0; font-size: 13px; font-weight: bold; color: #0f172a;">${userLocation.displayName || 'Current Device Position'}</h4>
        </div>
      `;

      marker.bindPopup(popupHtml);
      userLocGroup.addLayer(marker);

      if (userLocation.accuracyRadius && userLocation.accuracyRadius > 0) {
        const accuracyCircle = L.circle([userLocation.lat, userLocation.lng], {
          radius: Math.min(userLocation.accuracyRadius, 2000),
          color: '#0284c7',
          fillColor: '#0284c7',
          fillOpacity: 0.12,
          weight: 1.5,
        });
        userLocGroup.addLayer(accuracyCircle);
      }

      map.flyTo([userLocation.lat, userLocation.lng], 15, {
        duration: 1.2,
      });

      setTimeout(() => {
        marker.openPopup();
      }, 1300);
    }
  }, [userLocation]);

  // Handle Searched Location Pin
  useEffect(() => {
    const map = mapInstanceRef.current;
    const searchPinGroup = searchPinGroupRef.current;

    if (!map || !searchPinGroup) return;

    searchPinGroup.clearLayers();

    if (searchedLocationPin) {
      const pinIcon = createSearchPinIcon();
      const marker = L.marker([searchedLocationPin.lat, searchedLocationPin.lng], {
        icon: pinIcon,
        zIndexOffset: 1000,
      });

      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 160px;">
          <span style="font-size: 10px; font-weight: bold; color: #0284c7; text-transform: uppercase;">📍 Searched Location</span>
          <h4 style="margin: 2px 0 0 0; font-size: 13px; font-weight: bold; color: #0f172a;">${searchedLocationPin.displayName}</h4>
        </div>
      `;

      marker.bindPopup(popupHtml);
      searchPinGroup.addLayer(marker);

      map.flyTo([searchedLocationPin.lat, searchedLocationPin.lng], 14, {
        duration: 1.2,
      });

      setTimeout(() => {
        marker.openPopup();
      }, 1300);
    }
  }, [searchedLocationPin]);

  // Handle Route Polyline Rendering
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeGroup = routeGroupRef.current;

    if (!map || !routeGroup) return;

    routeGroup.clearLayers();

    if (route && route.coordinates.length > 0) {
      // Draw Polyline Line
      const polyline = L.polyline(route.coordinates as L.LatLngExpression[], {
        color: '#f97316', // Orange navigation route line
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      });

      routeGroup.addLayer(polyline);

      // Start Pin Marker
      const startCoord = route.coordinates[0];
      const startIcon = L.divIcon({
        html: `<div style="background:#10b981; color:white; border:2px solid white; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; box-shadow:0 2px 6px rgba(0,0,0,0.3);">A</div>`,
        className: 'route-start-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const startMarker = L.marker(startCoord, { icon: startIcon }).bindPopup(
        `<b>Origin:</b> ${route.originName}`
      );
      routeGroup.addLayer(startMarker);

      // End Pin Marker
      const endCoord = route.coordinates[route.coordinates.length - 1];
      const endIcon = L.divIcon({
        html: `<div style="background:#ea580c; color:white; border:2px solid white; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; box-shadow:0 2px 6px rgba(0,0,0,0.3);">B</div>`,
        className: 'route-end-pin',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const endMarker = L.marker(endCoord, { icon: endIcon }).bindPopup(
        `<b>Destination:</b> ${route.destinationName}`
      );
      routeGroup.addLayer(endMarker);

      // Fit map bounds to show complete route
      map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
    }
  }, [route]);

  // Update Pandals Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    pandalMarkersMapRef.current.clear();

    if (pandals.length === 0) return;

    const bounds = L.latLngBounds([]);

    pandals.forEach((pandal) => {
      const isSelected = pandal.id === selectedPandalId;
      const icon = createGanpatiIcon(pandal.crowdLevel, isSelected);

      const marker = L.marker([pandal.latitude, pandal.longitude] as [number, number], { icon });
      pandalMarkersMapRef.current.set(pandal.id, marker);

      // Popup Content
      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 180px;">
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #1c1917;">${pandal.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #78716c;">📍 ${pandal.area}</p>
          <div style="font-size: 11px; font-weight: 600; color: #ea580c; margin-bottom: 8px;">Crowd: ${pandal.crowdLevel}</div>
          <button id="pandal-btn-${pandal.id}" style="
            width: 100%;
            background: linear-gradient(to right, #f97316, #f59e0b);
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">View Details 🌺</button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectPandal(pandal);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`pandal-btn-${pandal.id}`);
        if (btn) {
          btn.onclick = () => onSelectPandal(pandal);
        }
      });

      markersGroup.addLayer(marker);
      bounds.extend([pandal.latitude, pandal.longitude]);
    });

    // Handle smooth pan / zoom when selectedPandalId changes
    if (selectedPandalId) {
      const selected = pandals.find((p) => p.id === selectedPandalId);
      if (selected) {
        // Smooth flyTo to the marker
        map.flyTo([selected.latitude, selected.longitude], 15, {
          duration: 1.2,
          easeLinearity: 0.25,
        });

        // Open popup automatically for the focused marker
        const marker = pandalMarkersMapRef.current.get(selectedPandalId);
        if (marker) {
          setTimeout(() => {
            marker.openPopup();
          }, 600);
        }
      }
    } else if (!searchedLocationPin && pandals.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [pandals, selectedPandalId, searchedLocationPin]);

  // Update Stations Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const stationsGroup = stationsGroupRef.current;

    if (!map || !stationsGroup) return;

    stationsGroup.clearLayers();

    if (!showStations) return;

    MUMBAI_TRANSIT_STATIONS.forEach((station: RailwayStation) => {
      const icon = createStationMarkerIcon(station.line);
      const marker = L.marker([station.latitude, station.longitude], { icon });

      const nearbyListHtml = station.nearbyPandals
        .map((pName) => `<li style="margin-bottom: 2px;">• ${pName}</li>`)
        .join('');

      const popupHtml = `
        <div style="font-family: sans-serif; min-width: 200px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 800; background: #0f172a; color: #f8fafc; padding: 2px 6px; border-radius: 4px;">
              🚉 ${station.line}
            </span>
            <span style="font-size: 9px; font-weight: 700; color: #64748b;">${station.zone}</span>
          </div>
          <h4 style="margin: 0 0 2px 0; font-size: 13px; font-weight: 800; color: #0f172a;">${station.name}</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569; line-height: 1.3;">${station.description}</p>
          <div style="background: #fef3c7; border: 1px solid #fde68a; padding: 6px; border-radius: 8px; font-size: 10px; color: #78350f;">
            <strong>Nearby Pandals:</strong>
            <ul style="margin: 4px 0 0 0; padding-left: 12px; list-style-type: none;">
              ${nearbyListHtml}
            </ul>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      stationsGroup.addLayer(marker);
    });
  }, [showStations]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Control Buttons Overlay */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col sm:flex-row items-end sm:items-center gap-2">
        <button
          type="button"
          onClick={() => setShowStations(!showStations)}
          className={`px-3 py-2 rounded-2xl font-bold text-xs shadow-xl border backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer ${
            showStations
              ? 'bg-amber-600 text-white border-amber-700'
              : 'bg-white/90 text-stone-800 border-stone-300 hover:bg-stone-100'
          }`}
          title="Toggle Station & Metro Pins on Map"
        >
          <span>🚉</span>
          <span>{showStations ? 'Stations Shown (21)' : 'Show Stations'}</span>
        </button>

        {onLocateMe && (
          <button
            type="button"
            onClick={onLocateMe}
            disabled={isLocating}
            className="bg-white/95 hover:bg-amber-50 text-stone-800 font-bold text-xs px-3 py-2 rounded-2xl shadow-xl border border-amber-300 backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
            title="Detect & center on my current GPS location"
          >
            {isLocating ? (
              <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-orange-500 text-sm">🎯</span>
            )}
            <span className="text-stone-900 font-extrabold">
              {isLocating ? 'Locating...' : 'My GPS Location'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
