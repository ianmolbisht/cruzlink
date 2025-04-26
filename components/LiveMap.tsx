"use client";

import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;

const pulsingIcon = L.divIcon({
  html: `
    <div class="relative w-6 h-6">
      <div class="absolute w-6 h-6 bg-blue-500 rounded-full border-2 border-white z-10"></div>
      <div class="absolute w-12 h-12 bg-blue-500 opacity-20 rounded-full animate-ping left-[-12px] top-[-12px]"></div>
    </div>
  `,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

export default function LiveMap({ lat, lng, accuracy }: { lat: number; lng: number; accuracy: number }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="map-container">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={pulsingIcon} />
        <Circle
          center={[lat, lng]}
          radius={accuracy}
          pathOptions={{
            fillColor: "blue",
            color: "blue",
            opacity: 0.3,
            fillOpacity: 0.15,
          }}
        />
        <RecenterMap lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}
