import mongoose from "mongoose";

import { ROLES, ROLE_LIST } from "../constants/roles";

const staffSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  phone: { type: String },
  status: { type: String, default: "active" },
  clinicId: { type: String },
  doctorId: { type: String },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ROLE_LIST,
    default: ROLES.RECEPTIONIST 
  }
}, { timestamps: true });

// Ensure any existing model is replaced to avoid schema conflicts during development
if (mongoose.models.Staff) {
  delete mongoose.models.Staff;
}

export default mongoose.model("Staff", staffSchema);
