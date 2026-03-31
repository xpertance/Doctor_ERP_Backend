import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:{ type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
