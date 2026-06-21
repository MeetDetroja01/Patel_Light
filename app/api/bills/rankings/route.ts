import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/lib/models/Bill";

// GET /api/bills/rankings?type=city|state|transport|customer&sort=revenue|count|avg|amount|name
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "city";
  const sort = searchParams.get("sort") || "revenue";
  const filterQ = searchParams.get("filter") || "";

  if (type === "customer") {
    let query = Bill.find({}).select("customer_name shop_name mobile_number city state transport_name total_amount bill_number date");
    if (filterQ) {
      query = query.where({
        $or: [
          { customer_name: { $regex: filterQ, $options: "i" } },
          { city: { $regex: filterQ, $options: "i" } },
        ],
      });
    }
    const bills = await query.sort(sort === "name" ? { customer_name: 1 } : { total_amount: -1 }).lean();
    return NextResponse.json({ items: bills });
  }

  const fieldMap: Record<string, string> = {
    city: "city",
    state: "state",
    transport: "transport_name",
  };
  const groupField = fieldMap[type] || "city";

  const sortFieldMap: Record<string, { [key: string]: 1 | -1 }> = {
    revenue: { revenue: -1 },
    count: { count: -1 },
    avg: { avg: -1 },
  };
  const sortStage: { [key: string]: 1 | -1 } = sortFieldMap[sort] || { revenue: -1 };

  const matchFilter: Record<string, unknown> = { [groupField]: { $ne: "" } };
  if (filterQ) matchFilter[groupField] = { $regex: filterQ, $options: "i" };

  const items = await Bill.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: `$${groupField}`,
        count: { $sum: 1 },
        revenue: { $sum: "$total_amount" },
      },
    },
    { $addFields: { label: "$_id", avg: { $divide: ["$revenue", "$count"] } } },
    { $sort: sortStage },
  ]);

  return NextResponse.json({ items });
}
