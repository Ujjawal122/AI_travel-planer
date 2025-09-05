import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, 
    destination: { type: String, required: true },
    days: { type: Number, required: true },
    traveler: { type: String, required: true },
    budget: { type: String, required: true },
    interests: { type: String },
    plan: { type: Object, required: true }, 
  },
  { timestamps: true }
);

const Trip = mongoose.models.Trip || mongoose.model("Trip", tripSchema);

export default Trip;
