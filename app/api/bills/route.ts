import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/lib/models/Bill";

// GET /api/bills — list with pagination + filters
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "0");
  const limit = parseInt(searchParams.get("limit") || "20");
  const state = searchParams.get("state") || "";
  const city = searchParams.get("city") || "";
  const transport = searchParams.get("transport") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (state) filter.state = { $regex: new RegExp(`^${state}$`, "i") };
  if (city) filter.city = { $regex: new RegExp(`^${city}$`, "i") };
  if (transport) filter.transport_name = { $regex: new RegExp(`^${transport}$`, "i") };

  const [bills, total] = await Promise.all([
    Bill.find(filter)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean(),
    Bill.countDocuments(filter),
  ]);

  return NextResponse.json({ bills, total, page, limit });
}

// POST /api/bills — create
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();

  if (!body.customer_name || !body.date || !body.shop_name || !body.state || !body.city || !body.transport_name) {
    return NextResponse.json({ error: "Date, Customer Name, Shop Name, State, City and Transport are required." }, { status: 400 });
  }

  const bill = await Bill.create(body);
  return NextResponse.json({ bill }, { status: 201 });
}
