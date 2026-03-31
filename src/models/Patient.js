import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
     
    },
    lastName: {
      type: String,
      
    },
    dateOfBirth: {
      type: String,
      
    },
    gender: {
      type: String,
     
    },
    phone: {
      type: String,
     
    },
    email: {
      type: String,
    
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    medicalHistory: {
      type: String,
    },
    allergies: {
      type: String,
    },
    currentMedications: {
      type: String,
    },
    symptoms: {
      type: String,
    
    },
    bloodType:{
        type:String
    },
    password:{
        type:String
    },
      role:{type:String,default:"patient"},
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
delete mongoose.models.Patient
export default mongoose.models.Patient || mongoose.model("Patient", patientSchema);
