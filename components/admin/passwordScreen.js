// components/PasswordScreen.js
import React, { useState } from "react";
import Cookies from "js-cookie";

const PasswordScreen = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Fetch the password from /public/guiSettings.json
    const response = await fetch("/guiSettings.json");
    const settings = await response.json();
    const correctPassword = settings.guiPassword;

    if (password === correctPassword) {
      // Set a cookie that expires in 1 hour
      Cookies.set("video-auth", "true", { expires: 1 / 24 });
      onAuthenticate(true);
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default PasswordScreen;
