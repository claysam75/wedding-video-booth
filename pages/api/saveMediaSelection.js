// pages/api/saveMediaSelection.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { videoDevice, audioDevice } = req.body;

    const filePath = path.join(process.cwd(), "public", "mediaSelection.json");
    const data = { videoDevice, audioDevice };

    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      res.status(200).json({ message: "Media selection saved successfully" });
    } catch (err) {
      res.status(500).json({ error: "Failed to save media selection" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
