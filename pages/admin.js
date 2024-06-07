// pages/index.js

import React, { useState, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import RecordingsList from "@/components/admin/recordingsList";
import VideoSetupForm from "@/components/admin/videoSetup";
import LogoutButton from "@/components/admin/logoutButton";

// Dynamically import the component to prevent SSR issues
const MediaSelect = dynamic(() => import("../components/admin/mediaSelect"), {
  ssr: false,
});

// Dynamically import the PasswordScreen to avoid server-side rendering issues
const PasswordScreen = dynamic(
  () => import("../components/admin/passwordScreen"),
  {
    ssr: false,
  }
);

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check for the auth cookie
    const auth = Cookies.get("video-auth");
    if (auth) {
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return <PasswordScreen onAuthenticate={setAuthenticated} />;
  }
  return (
    <div>
      <Head>
        <title>Webcam Selector</title>
        <meta name="description" content="A page to select your webcam" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Admin</h1>
        <MediaSelect />
        <br></br>
        <hr></hr>
        <br></br>
        <RecordingsList />
        <br></br>
        <hr></hr>
        <br></br>
        <VideoSetupForm />
        <br></br>
        <hr></hr>
        <br></br>
        <LogoutButton onLogout={setAuthenticated} />
      </main>
    </div>
  );
}
