import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBill extends Document {
  date: string;
  bill_number: string;
  customer_name: string;
  mobile_number: string;
  shop_name: string;
  city: string;
  state: string;
  transport_name: string;
  items_sent: string;
  total_amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new Schema<IBill>(
  {
    date: { type: String, required: true },
    bill_number: { type: String, required: true },
    customer_name: { type: String, required: true },
    mobile_number: { type: String, default: "" },
    shop_name: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    transport_name: { type: String, default: "" },
    items_sent: { type: String, default: "" },
    total_amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for fast searches
BillSchema.index({ customer_name: "text", shop_name: "text", city: "text", state: "text", mobile_number: "text", bill_number: "text", transport_name: "text" });
BillSchema.index({ createdAt: -1 });
BillSchema.index({ city: 1 });
BillSchema.index({ state: 1 });
BillSchema.index({ transport_name: 1 });

const Bill: Model<IBill> =
  mongoose.models.Bill || mongoose.model<IBill>("Bill", BillSchema);

export default Bill;
