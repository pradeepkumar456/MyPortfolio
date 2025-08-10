// scripts/createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Pradeep";

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function createAdmin() {
  const plainPassword = "Admin123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = new Admin({
    email: "adigangwar1@gmail.com",
    password: hashedPassword,
  });

  await admin.save();
  console.log("✅ Admin created:", admin);
  mongoose.connection.close();
}

createAdmin();
