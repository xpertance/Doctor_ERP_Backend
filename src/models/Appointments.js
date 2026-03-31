import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: {type:String},
  doctorId:{type:String},
  doctorName:{type:String},
  doctorFees:{type:String},
  patientEmail: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  patientNote:{type:String},
  patientNumber:{type:String},
  appointmentDate:{type:String},
  time:{type:String},
  day:{type:String},
  status:{type:String , default:"pending"},
   medicines: [
    {
      name: { type: String },
      dosage: { type: String },
      duration: { type: String },
      frequency: { type: String }
    }
  ],
  description: { type: String },
}, { timestamps: true });
delete mongoose.models.Appointment
export default mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
