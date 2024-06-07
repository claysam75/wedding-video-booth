import { useState, useEffect, useRef } from "react";

const VideoSetupForm = () => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const getVideoSettings = async () => {
      const savedVideoSettings = await fetch("/videoSettings.json");
      const { countdownValue } = await savedVideoSettings.json();

      if (countdownValue) {
        setCountdown(countdownValue);
      }
    };

    getVideoSettings();
  }, []);

  const handleCountdownChange = (event) => {
    setCountdown(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      countdownValue: countdown,
    };

    try {
      const response = await fetch("/api/saveVideoSettings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to save video settings");
      }
      alert("Video settings saved successfully");
    } catch (err) {
      console.error("Error saving video settings", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="countdownInput">
            Countdown before recording starts (s)
          </label>
          <input
            type="number"
            value={countdown}
            onChange={handleCountdownChange}
          ></input>
        </div>
      </form>
    </div>
  );
};

export default VideoSetupForm;
