import { NextRequest, NextResponse } from "next/server";

// Proxy: GET /api/locations/cities?state=Gujarat
// Fetches cities for a given Indian state from CountriesNow
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state") || "";
  if (!state) return NextResponse.json({ cities: [] });

  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: "India", state }),
        next: { revalidate: 86400 },
      }
    );
    const json = await res.json();
    if (json.error) return NextResponse.json({ cities: [] });
    const cities: string[] = (json.data || []).sort();
    return NextResponse.json({ cities });
  } catch {
    return NextResponse.json({ cities: [] }, { status: 500 });
  }
}
