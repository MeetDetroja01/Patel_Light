import { NextResponse } from "next/server";

// Proxy: GET /api/locations/states
// Fetches all states for India from CountriesNow (no API key required)
export async function GET() {
  try {
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
      next: { revalidate: 86400 }, // cache 24 hours
    });
    const json = await res.json();
    const india = json.data?.find(
      (c: { name: string }) => c.name === "India"
    );
    if (!india) return NextResponse.json({ states: [] });
    const states: string[] = india.states
      .map((s: { name: string }) => s.name)
      .sort();
    return NextResponse.json({ states });
  } catch {
    return NextResponse.json({ states: [] }, { status: 500 });
  }
}
