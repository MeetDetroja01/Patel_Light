import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/lib/models/Bill";

// POST /api/bills/import — bulk insert from parsed CSV/Excel rows
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { rows } = await req.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "No rows provided." }, { status: 400 });
  }

  // Map flexible column names to schema fields
  const mapped = rows.map((r: Record<string, string>) => ({
    date:           r["date"]           || r["Date"]           || "",
    bill_number:    r["bill_number"]    || r["Bill Number"]    || r["BillNumber"]    || "",
    customer_name:  r["customer_name"]  || r["Customer Name"]  || r["CustomerName"]  || "",
    mobile_number:  r["mobile_number"]  || r["Mobile Number"]  || r["Mobile"]        || "",
    shop_name:      r["shop_name"]      || r["Shop Name"]      || r["ShopName"]      || "",
    state:          r["state"]          || r["State"]          || "",
    city:           r["city"]           || r["City"]           || "",
    transport_name: r["transport_name"] || r["Transport Name"] || r["Transport"]     || "",
    items_sent:     r["items_sent"]     || r["Items Sent"]     || r["Items"]         || "",
    total_amount:   parseFloat(r["total_amount"] || r["Total Amount"] || r["Amount"] || "0") || 0,
  }));

  const valid = mapped.filter((r) => r.customer_name && r.date);
  if (valid.length === 0) {
    return NextResponse.json({ error: "No valid rows found. Make sure columns include at least Date and Customer Name." }, { status: 400 });
  }

  const inserted = await Bill.insertMany(valid, { ordered: false });
  return NextResponse.json({ inserted: inserted.length, skipped: rows.length - valid.length });
}
