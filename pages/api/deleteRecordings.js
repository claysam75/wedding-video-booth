// pages/api/delete-recordings.js

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const recordingsDir = path.join(process.cwd(), "public", "recordings");

  try {
    const files = fs.readdirSync(recordingsDir);
    console.log(files);
    files.forEach((file) => {
      fs.unlinkSync(path.join(recordingsDir, file));
    });
    res.status(200).json({ message: "Recordings deleted successfully" });
  } catch (error) {
    console.error("Error deleting recordings:", error);
    res.status(500).json({ error: "Failed to delete recordings" });
  }
}
