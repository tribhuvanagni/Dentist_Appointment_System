import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Dentist from "./models/Dentist.js";
import { dentists } from "./data/dentists.js";

dotenv.config({ path: new URL("./.env", import.meta.url) });

async function run() {
  try {
    await connectDB();
    await Dentist.deleteMany({});
    await Dentist.insertMany(dentists);
    console.log(`Seeded ${dentists.length} dentists`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err?.message || err);
    process.exit(1);
  }
}

run();

