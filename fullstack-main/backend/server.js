import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// MongoDB Connection
mongoose.connect("mongodb://Pratyush:%40Sta1510@ac-4okzjve-shard-00-00.hpwu54z.mongodb.net:27017,ac-4okzjve-shard-00-01.hpwu54z.mongodb.net:27017,ac-4okzjve-shard-00-02.hpwu54z.mongodb.net:27017/?ssl=true&replicaSet=atlas-olh5mz-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("✅ DB Connected"))
  .catch(err => {
    console.log("❌ DB Error:");
    console.log(err);
  });

// Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/users", async (req, res) => {
  try {
    await User.create(req.body);
    res.send("User Saved");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/users", async (req, res) => {
  try {
    const { name } = req.query;

    let filter = {};
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const users = await User.find(filter);
    res.json(users);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ✅ FORCE PORT 3000 (no env override)
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});