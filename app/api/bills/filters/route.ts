import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/lib/models/Bill";

// GET /api/bills/filters — distinct states, cities, transports
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const [states, cities, transports] = await Promise.all([
    Bill.distinct("state").then((r) => r.filter(Boolean).sort()),
    Bill.distinct("city").then((r) => r.filter(Boolean).sort()),
    Bill.distinct("transport_name").then((r) => r.filter(Boolean).sort()),
  ]);

  return NextResponse.json({ states, cities, transports });
}
