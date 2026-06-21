import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/lib/models/Bill";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const [statsAgg, cityAgg, stateAgg, transportAgg, topCustomers] = await Promise.all([
    // Overall stats
    Bill.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          revenue: { $sum: "$total_amount" },
          cities: { $addToSet: "$city" },
          states: { $addToSet: "$state" },
          transports: { $addToSet: "$transport_name" },
        },
      },
    ]),
    // Cities
    Bill.aggregate([
      { $match: { city: { $ne: "" } } },
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $addFields: { avg: { $divide: ["$revenue", "$count"] } } },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]),
    // States
    Bill.aggregate([
      { $match: { state: { $ne: "" } } },
      {
        $group: {
          _id: "$state",
          count: { $sum: 1 },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $addFields: { avg: { $divide: ["$revenue", "$count"] } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    // Transport
    Bill.aggregate([
      { $match: { transport_name: { $ne: "" } } },
      {
        $group: {
          _id: "$transport_name",
          count: { $sum: 1 },
          revenue: { $sum: "$total_amount" },
        },
      },
      { $addFields: { avg: { $divide: ["$revenue", "$count"] } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    // Top 10 customers
    Bill.find({})
      .sort({ total_amount: -1 })
      .limit(10)
      .select("customer_name shop_name mobile_number city state total_amount")
      .lean(),
  ]);

  const stats = statsAgg[0] || { total: 0, revenue: 0, cities: [], states: [], transports: [] };

  return NextResponse.json({
    stats: {
      total: stats.total,
      revenue: stats.revenue,
      avg: stats.total ? stats.revenue / stats.total : 0,
      cities: stats.cities.filter(Boolean).length,
      states: stats.states.filter(Boolean).length,
      transports: stats.transports.filter(Boolean).length,
    },
    cityAgg,
    stateAgg,
    transportAgg,
    topCustomers,
  });
}
