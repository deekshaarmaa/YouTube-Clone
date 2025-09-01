"use client";

import React, { useRef, useState } from "react";

// ✅ Your VideoCall component
function VideoCall() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  // Start call
  const startCall = async () => {
    peerConnection.current = new RTCPeerConnection();

    // Display local video
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    stream.getTracks().forEach((track) => {
      peerConnection.current?.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // ⚠️ Placeholder signaling logic
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setRemoteDescription(offer);
    await peerConnection.current.setLocalDescription(answer);

    setIsCallActive(true);
  };

  // Share screen
  const shareScreen = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const screenTrack = screenStream.getVideoTracks()[0];
    const sender = peerConnection.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");

    sender?.replaceTrack(screenTrack);

    screenTrack.onended = () => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        const camTrack = stream.getVideoTracks()[0];
        sender?.replaceTrack(camTrack);
      });
    };
  };

  // Record call
  const startRecording = () => {
    if (!localVideoRef.current?.srcObject) return;

    const stream = new MediaStream([
      ...(localVideoRef.current.srcObject as MediaStream).getTracks(),
      ...(remoteVideoRef.current?.srcObject
        ? (remoteVideoRef.current.srcObject as MediaStream).getTracks()
        : []),
    ]);

    mediaRecorder.current = new MediaRecorder(stream);
    recordedChunks.current = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">📹 VoIP Video Call</h2>

      <div className="flex gap-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-60 h-40 bg-black rounded-lg"
        ></video>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-60 h-40 bg-black rounded-lg"
        ></video>
      </div>

      <div className="flex gap-4 mt-4">
        {!isCallActive && (
          <button
            onClick={startCall}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Start Call
          </button>
        )}

        {isCallActive && (
          <>
            <button
              onClick={shareScreen}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Share Screen
            </button>

            {!isRecording ? (
              <button
                onClick={startRecording}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg"
              >
                Stop Recording
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Page wrapper like VoIP example
export default function CallPage() {
  return <VideoCall />;
}
