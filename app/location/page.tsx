"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Navigation, RefreshCwIcon as RefreshIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileLayout } from "@/components/mobile-layout";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("@/components/LiveMap"), { ssr: false });

export default function LocationPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setLocation({ lat: latitude, lng: longitude, accuracy });
          setLoading(false);
        },
        (err) => {
          setError("Failed to get location");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const refreshLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setLocation({ lat: latitude, lng: longitude, accuracy });
          setLoading(false);
        },
        (err) => {
          setError("Unable to fetch updated location.");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center p-4 border-b">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">My Location</h1>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <MapPin className="h-12 w-12 text-green-500 animate-pulse mb-4" />
              <p className="text-sm text-gray-500">Getting your location...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={refreshLocation}>Try Again</Button>
            </div>
          ) : (
            <>
              <div className="h-[500px] w-full rounded-lg overflow-hidden mb-4">
                <LiveMap lat={location!.lat} lng={location!.lng} accuracy={location!.accuracy} />
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-sm font-medium">Current Location</h2>
                  <Button variant="outline" size="sm" onClick={refreshLocation} className="h-8">
                    <RefreshIcon className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>

                <div className="text-sm">
                  <div className="flex items-center mb-1">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{`${location!.lat.toFixed(6)}, ${location!.lng.toFixed(6)}`}</span>
                  </div>
                  <div className="flex items-center">
                    <Navigation className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{`Accuracy: ±${Math.round(location!.accuracy)} meters`}</span>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">Share My Location</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
