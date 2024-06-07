// components/mediaForm.js
import { useState, useEffect, useRef } from "react";

const MediaForm = () => {
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const videoRef = useRef(null);
  const audioLevelRef = useRef(null);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = mediaDevices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioInputs = mediaDevices.filter(
          (device) => device.kind === "audioinput"
        );
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);

        const savedMediaSelection = await fetch("/mediaSelection.json");
        const { videoDevice, audioDevice } = await savedMediaSelection.json();

        if (videoDevice) {
          setSelectedVideoDevice(videoDevice);
        }
        if (audioDevice) {
          setSelectedAudioDevice(audioDevice);
        }
      } catch (err) {
        console.error(
          "Error accessing media devices or saved media selection.",
          err
        );
      }
    };

    getMediaDevices();
  }, []);

  useEffect(() => {
    if (selectedVideoDevice) {
      startVideoPreview();
    }
  }, [selectedVideoDevice]);

  const startVideoPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoDevice },
        audio: { deviceId: selectedAudioDevice },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const audioContext = new AudioContext();
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;
      mediaStreamSource.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        const level = Math.min(average / 255, 1);
        if (audioLevelRef.current) {
          audioLevelRef.current.style.width = `${level * 100}%`;
        }
        requestAnimationFrame(drawAudioLevel);
      };

      drawAudioLevel();
    } catch (err) {
      console.error("Error starting video preview:", err);
    }
  };

  const handleVideoChange = (event) => {
    setSelectedVideoDevice(event.target.value);
  };

  const handleAudioChange = (event) => {
    setSelectedAudioDevice(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      videoDevice: selectedVideoDevice,
      audioDevice: selectedAudioDevice,
    };

    try {
      const response = await fetch("/api/saveMediaSelection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to save media selection");
      }
      alert("Media selection saved successfully!");
    } catch (err) {
      console.error("Error saving media selection:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="video-select">Select Webcam: </label>
          <select
            id="video-select"
            value={selectedVideoDevice}
            onChange={handleVideoChange}
          >
            {videoDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="audio-select">Select Microphone: </label>
          <select
            id="audio-select"
            value={selectedAudioDevice}
            onChange={handleAudioChange}
          >
            {audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </form>
      <div>
        <h2>Video Preview</h2>
        {selectedVideoDevice && (
          <video ref={videoRef} autoPlay playsInline muted />
        )}
      </div>
      <div>
        <h2>Audio Level</h2>
        <div className="w-32 h-4 bg-blue-200 mt-2">
          <div ref={audioLevelRef} className="h-full bg-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default MediaForm;
