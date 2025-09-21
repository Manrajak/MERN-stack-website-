import mongoose from 'mongoose';
const AgentSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  password: String
});
export default mongoose.model("Agent", AgentSchema);