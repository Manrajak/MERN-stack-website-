import express from 'express';
import multer from 'multer';
// import csvParse from 'csv-parse/lib/sync';
import { parse } from "csv-parse/sync";
import XLSX from 'xlsx';
import DistributedList from '../models/DistributedList.js'
import AgentModel from '../models/Agent.js';
const router = express.Router();

const upload = multer({ dest: 'uploads/' });
import fs from 'fs';

function parseFile(file) {
  const ext = file.originalname.split('.').pop().toLowerCase();
  if (ext === 'csv') {
    const content = fs.readFileSync(file.path);
    return parse(content, {
      columns: true,
      skip_empty_lines: true
    });
  } else if (['xlsx', 'xls'].includes(ext)) {
    const workbook = XLSX.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
  }
  throw new Error('Invalid file type');
}

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const items = parseFile(req.file);
    // Validate format
    if (!items.every(item => item.FirstName && item.Phone && item.Notes)) {
      return res.status(400).json({ error: 'Invalid format. Columns: FirstName, Phone, Notes required.' });
    }
    // Fetch agents from DB
    const agents = await AgentModel.find({}, { password: 0 });
    if (agents.length === 0) return res.status(400).json({ error: "No agents available" });

    // Distribute items among agents
    const distributed = agents.map(() => []);
    items.forEach((item, idx) => {
      distributed[idx % agents.length].push({ ...item, status: "active" });
    });

    // Save to DB
    await DistributedList.deleteMany({});
    await DistributedList.create(agents.map((agent, i) => ({
      agentId: agent._id,
      agentName: agent.name,
      agentEmail: agent.email,
      items: distributed[i]
    })));

    res.json({ lists: agents.map((agent, i) => ({
      agentId: agent._id,
      agentName: agent.name,
      agentEmail: agent.email,
      items: distributed[i]
    })) });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/distributed', async (req, res) => {
  const lists = await DistributedList.find();
  res.json({ lists });
});

// Pause/Resume/Delete a task
router.patch('/task/:agentId/:itemIdx', async (req, res) => {
  const { agentId, itemIdx } = req.params;
  const { status } = req.body;
  const list = await DistributedList.findOne({ agentId });
  if (!list) return res.status(404).json({ error: "Agent not found" });
  list.items[itemIdx].status = status;
  await list.save();
  res.json({ success: true, item: list.items[itemIdx] });
});

export default router;
//# sourceMappingURL=distributedList.js.map