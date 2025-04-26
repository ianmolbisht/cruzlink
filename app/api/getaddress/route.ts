import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return new Response(JSON.stringify({ error: "Missing lat or lng" }), { status: 400 });
  }

  const API_KEY = process.env.OPENCAGE_API_KEY;
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "Missing API key" }), { status: 500 });
  }

  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    `${lat},${lng}`
  )}&key=${API_KEY}&language=en`;

  try {
    const response = await fetch(url, { cache: "no-store" }); // important to avoid cache
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("Error fetching from OpenCage:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), { status: 500 });
  }
}
