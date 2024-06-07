// components/RecordingsList.js

import { useEffect, useState } from "react";

const RecordingsList = () => {
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    fetch("/api/recordings")
      .then((response) => response.json())
      .then((data) => setRecordings(data))
      .catch((error) => console.error("Error fetching recordings:", error));
  }, []);

  const handleDownload = (filename) => {
    fetch(`/public/recordings/${filename}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all recordings?")) {
      fetch("/api/deleteRecordings", { method: "DELETE" })
        .then(() => {
          // Refresh the recordings list after deletion
          setRecordings([]);
        })
        .catch((error) => console.error("Error deleting recordings:", error));
    }
  };

  return (
    <div>
      <h2>List of Recordings</h2>
      <button onClick={handleDeleteAll}>Delete All Recordings</button>
      <ul>
        {recordings.map((recording, index) => (
          <li key={index}>
            <button onClick={() => handleDownload(recording.name)}>
              {recording.name}
            </button>
            - Created at: {recording.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecordingsList;
