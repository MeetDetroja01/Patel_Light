import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/lib/models/Bill";

// GET /api/bills/export — returns all bills as JSON for client-side rendering
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const bills = await Bill.find({})
    .sort({ createdAt: -1 })
    .select("date bill_number customer_name mobile_number shop_name state city transport_name items_sent total_amount")
    .lean();

  return NextResponse.json({ bills });
}
