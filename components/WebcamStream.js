// components/WebcamStream.js
import { useEffect, useRef, useState } from "react";

const WebcamStream = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);
  const [savedCountdownValue, setSavedCountdownValue] = useState("");
  const [countdown, setCountdown] = useState(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch("/mediaSelection.json");
        const data = await response.json();
        const videoDeviceId = data.videoDevice;
        const audioDeviceId = data.audioDevice;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const constraints = {
            video: {
              deviceId: { exact: videoDeviceId },
              width: 1920,
              height: 1080,
            },
            audio: { deviceId: { exact: audioDeviceId } },
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
              if (event.data.size > 0) {
                chunksRef.current.push(event.data);
              }
            };

            mediaRecorderRef.current.onstop = () => {
              const blob = new Blob(chunksRef.current, { type: "video/webm" });
              chunksRef.current = [];
              saveRecording(blob);
            };
          }
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    const getCountdownValue = async () => {
      const videoSettings = await fetch("/videoSettings.json");
      const data = await videoSettings.json();
      const countdownValue = data.countdownValue;
      setSavedCountdownValue(countdownValue);
    };

    fetchDevices();
    getCountdownValue();
  }, []);
  const handleStartRecording = () => {
    setCountdown(savedCountdownValue);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownIntervalRef.current);
          setRecording(true);
          startRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "inactive"
    ) {
      mediaRecorderRef.current.start();
    }
  };

  const handleCancelRecordingDuringCountdown = () => {
    setRecording(false);
    setCountdown(null);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const handleFinishRecording = () => {
    setRecording(false);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const saveRecording = async (blob) => {
    try {
      const formData = new FormData();
      formData.append("video", blob, "recording.webm");

      const response = await fetch("/api/saveRecording", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to save recording");
      }

      const { success, filename, error } = await response.json();
      if (success) {
        console.log(`Recording saved successfully as ${filename}`);
      } else {
        throw new Error(error || "Failed to save recording");
      }
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };

  return (
    <div
      className={`h-screen flex justify-center items-center bg-black relative ${
        recording ? "border-4 border-red-500" : ""
      }`}
    >
      <video ref={videoRef} autoPlay playsInline className="h-full w-auto" />
      {!recording && countdown === null && (
        <button
          onClick={handleStartRecording}
          className="
          absolute top-4/5 left-1/2 inset-x-0 bottom-0
          transform -translate-x-1/2 -translate-y-1/2 
          py-10
          text-4xl 
          bg-green-500 bg-opacity-70 
          border-none 
          rounded-full 
          cursor-pointer
        "
        >
          Start Recording
        </button>
      )}
      {countdown !== null && (
        <div>
          <div
            className="
      absolute top-1/2 left-1/2 
      transform -translate-x-1/2 -translate-y-1/2 
      text-[100px] 
      text-white 
      bg-red-500 bg-opacity-50 
      px-5 py-2.5 
      rounded-[40px]
    "
          >
            {countdown}
          </div>
          <button
            onClick={handleCancelRecordingDuringCountdown}
            className="
          absolute top-4/5 left-1/2 inset-x-0 bottom-0
          transform -translate-x-1/2 -translate-y-1/2 
          py-20 
          text-4xl 
          bg-red-500 bg-opacity-70 
          border-none 
          rounded-full 
          cursor-pointer
        "
          >
            Cancel
          </button>
        </div>
      )}
      {recording && (
        <button
          onClick={handleFinishRecording}
          className="
          absolute top-4/5 left-1/2 inset-x-0 bottom-0
          transform -translate-x-1/2 -translate-y-1/2 
          py-20 
          text-4xl 
          bg-red-500 bg-opacity-70 
          border-none 
          rounded-full 
          cursor-pointer
        "
        >
          Finish Recording
        </button>
      )}
    </div>
  );
};

export default WebcamStream;
