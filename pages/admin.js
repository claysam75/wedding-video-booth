// pages/index.js
import Head from "next/head";
import dynamic from "next/dynamic";
import RecordingsList from "@/components/admin/recordingsList";
import VideoSetupForm from "@/components/admin/videoSetup";

// Dynamically import the component to prevent SSR issues
const MediaSelect = dynamic(() => import("../components/admin/mediaSelect"), {
  ssr: false,
});

export default function Admin() {
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
      </main>
    </div>
  );
}
