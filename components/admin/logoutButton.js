// components/LogoutButton.js
import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const LogoutButton = ({ onLogout }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the auth cookie
    Cookies.remove("video-auth");
    // Trigger the onLogout callback
    onLogout(false);
    // Redirect to the /admin page (which will show the password screen)
    router.push("/admin");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
