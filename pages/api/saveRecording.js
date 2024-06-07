// pages/api/upload.js

import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing, so we can handle file uploads
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const form = new IncomingForm();
  //specify temp location for storing uploaded files
  form.uploadDir = path.join(process.cwd(), "public", "recordings");
  form.keepExtensions = false;

  form.parse(req, (err, fields, files) => {
    console.log(files);
    if (err) {
      console.error("Error parsing form:", err);
      res.status(500).json({ error: "Error parsing form" });
      return;
    }

    const file = files["video"]; // Access the 'video' file from the parsed files

    const oldPath = files.video[0].filepath;
    const timestamp = Date.now(); // Get current timestamp
    const newFilename = `${timestamp}${".mp4"}`; // Construct new filename

    const newPath = path.join(form.uploadDir, newFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        res.status(500).json({ error: "Error saving file" });
        return;
      }

      res.status(200).json({ message: "Video uploaded successfully" });
    });
  });
}
