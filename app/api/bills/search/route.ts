import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/lib/models/Bill";

// GET /api/bills/search?q=term&field=all
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const field = searchParams.get("field") || "all";

  if (!q) return NextResponse.json({ bills: [] });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let filter: Record<string, any> = {};

  if (field === "all") {
    filter = {
      $or: [
        { customer_name: { $regex: q, $options: "i" } },
        { shop_name: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
        { state: { $regex: q, $options: "i" } },
        { mobile_number: { $regex: q, $options: "i" } },
        { transport_name: { $regex: q, $options: "i" } },
        { bill_number: { $regex: q, $options: "i" } },
      ],
    };
  } else {
    filter[field] = { $regex: q, $options: "i" };
  }

  const bills = await Bill.find(filter).sort({ createdAt: -1 }).limit(500).lean();
  return NextResponse.json({ bills });
}
