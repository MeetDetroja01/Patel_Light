import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bill from "@/lib/models/Bill";

type RouteContext = { params: Promise<{ id: string }> };

// PUT /api/bills/:id — update
export async function PUT(req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  await connectDB();
  const body = await req.json();
  const bill = await Bill.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ bill });
}

// DELETE /api/bills/:id — delete
export async function DELETE(_req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  await connectDB();
  await Bill.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
