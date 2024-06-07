// pages/index.js
import Head from "next/head";
import WebcamStream from "../components/WebcamStream";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Webcam Stream</title>
        <meta name="description" content="Video Booth" />
        <meta name="title" content="Video Booth" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <WebcamStream />
      </main>
    </div>
  );
}
