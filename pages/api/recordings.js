// pages/api/recordings.js

import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const recordingsDir = path.join(process.cwd(), "public", "recordings");
  const files = fs.readdirSync(recordingsDir);
  const recordings = files.map((file) => {
    const filePath = path.join(recordingsDir, file);
    const stats = fs.statSync(filePath);
    return { name: file, createdAt: stats.birthtime.toLocaleString() };
  });
  res.status(200).json(recordings);
}
