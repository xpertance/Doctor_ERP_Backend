import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  firstName: {type:String},
  lastName:{type:String},
  email: { type: String},
  phone:{type:String},
  status:{type:String},
  clinicId:{type:String},
  doctorId:{type:String},
  password: { type: String, required: true },
 role:{type:String,default:"Receptionist"}
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model("Staff", staffSchema);
