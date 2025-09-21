import mongoose from 'mongoose';

const DistributedListSchema = new mongoose.Schema({
  agentId: mongoose.Schema.Types.ObjectId,
  agentName: String,
  agentEmail: String,
  items: [
    {
      FirstName: String,
      Phone: String,
      Notes: String,
      status: { type: String, default: "active" }
    }
  ]
});

const DistributedList = mongoose.model('DistributedList', DistributedListSchema);
export default DistributedList;