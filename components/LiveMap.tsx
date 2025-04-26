"use client";

import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Pulsing marker icon
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

export default function LiveMap() {
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to call our server API route
  async function fetchAddress(lat: number, lng: number) {
    try {
      const res = await fetch(`/api/getaddress/geocode?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      console.log("Address data:", data);
    } catch (err) {
      console.error("Failed to fetch address:", err);
    }
  }
  

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    // First, get the current position immediately.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ lat: latitude, lng: longitude, accuracy });
        fetchAddress(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Failed to fetch location. Please allow GPS access.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Then, watch for updates.
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ lat: latitude, lng: longitude, accuracy });
        fetchAddress(latitude, longitude);
      },
      (err) => {
        console.error("WatchPosition error:", err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!location) {
    return <div className="text-center p-4">Loading your location...</div>;
  }

  const { lat, lng, accuracy } = location;

  return (
    <div className="map-container h-screen w-screen relative">
      <MapContainer center={[lat, lng]} zoom={18} scrollWheelZoom={true} className="h-full w-full z-0">
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

      {/* Display Accuracy and Address */}
      <div className="absolute bottom-4 left-4 p-4 bg-white rounded-lg shadow-lg text-sm">
        <p>
          <strong>Accuracy:</strong> {accuracy.toFixed(1)} meters
        </p>
        {address && (
          <p>
            <strong>Location:</strong> {address}
          </p>
        )}
      </div>
    </div>
  );
}
