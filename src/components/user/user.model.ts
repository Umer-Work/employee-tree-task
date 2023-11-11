import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  role : {
    type : String,
    enum: ['CEO', 'PM', 'TL', 'SR_DEV', 'JR_DEV', 'Intern'],
  },
  reportsTo : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  }
});

export default mongoose.model("User", userSchema);
