// yourtube/src/components/VoIP.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

type OfferPayload = { roomId: string; offer: RTCSessionDescriptionInit };
type AnswerPayload = { roomId: string; answer: RTCSessionDescriptionInit };
type SocketIcePayload = { roomId: string; candidate: RTCIceCandidateInit } | RTCIceCandidateInit;

export default function VoIP({ roomId = "default" }: { roomId?: string }) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:5000"); // adjust URL if your server differs
    socketRef.current = socket;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionRef.current = pc;

    let localStream: MediaStream | null = null;

    // join room on server
    socket.emit("join-room", roomId);

    // get local media and add to PC
    (async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
        localStream.getTracks().forEach((t) => pc.addTrack(t, localStream as MediaStream));
      } catch (err) {
        console.error("Error getting local media:", err);
      }
    })();

    // remote stream handling
    pc.ontrack = (event: RTCTrackEvent) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    // gather ICE and send minimal serializable candidate to server
    pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (event.candidate && socketRef.current) {
        // toJSON gives RTCIceCandidateInit
        const candidateInit: RTCIceCandidateInit =
          typeof event.candidate.toJSON === "function"
            ? event.candidate.toJSON()
            : (event.candidate as unknown as RTCIceCandidateInit);
        socketRef.current.emit("ice-candidate", { roomId, candidate: candidateInit });
      }
    };

    // someone else joined -> create offer (if you want caller-driven flow)
    socket.on("user-joined", async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      } catch (err) {
        console.error("Error creating offer:", err);
      }
    });

    // incoming offer
    socket.on("offer", async (data: OfferPayload) => {
      try {
        await pc.setRemoteDescription(data.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { roomId: data.roomId, answer });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    });

    // incoming answer
    socket.on("answer", async (data: AnswerPayload) => {
      try {
        await pc.setRemoteDescription(data.answer);
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    });

    // incoming ice candidate — handle both shapes
    socket.on("ice-candidate", async (payload: SocketIcePayload) => {
      try {
        // Narrow payload to RTCIceCandidateInit
        const candidateInit: RTCIceCandidateInit = "candidate" in (payload as any) ? (payload as any).candidate : (payload as RTCIceCandidateInit);
        await pc.addIceCandidate(new RTCIceCandidate(candidateInit));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    });

    // cleanup
    return () => {
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      try {
        socket.emit("leave-room", roomId);
      } catch (_) {}
      socket.disconnect();
      // stop local tracks
      if (localStream) localStream.getTracks().forEach((t) => t.stop());
      // close pc
      try {
        pc.getSenders().forEach((s) => s.track?.stop());
      } catch (_) {}
      pc.close();
      peerConnectionRef.current = null;
      socketRef.current = null;
    };
  }, [roomId]);

  // Helper: ensure we have a PeerConnection (usually created in useEffect)
  const ensurePeerConnection = () => {
    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
    }
    return peerConnectionRef.current;
  };

  // Start call (create offer)
  const startCall = async () => {
    try {
      setIsCallActive(true);
      const pc = ensurePeerConnection();

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit("offer", { roomId, offer });
    } catch (err) {
      console.error("Error starting call:", err);
    }
  };

  // Screen share — replace video sender track if possible
  const startScreenShare = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const sender = peerConnectionRef.current?.getSenders().find((s) => s.track?.kind === "video");
      const displayTrack = displayStream.getVideoTracks()[0];
      if (sender && displayTrack) {
        await sender.replaceTrack(displayTrack);
      } else if (displayTrack) {
        peerConnectionRef.current?.addTrack(displayTrack, displayStream);
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = displayStream;
      // stop screen share track when it ends
      displayTrack.onended = () => {
        // attempt to switch back to camera
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((camStream) => {
          const camTrack = camStream.getVideoTracks()[0];
          const senderAfter = peerConnectionRef.current?.getSenders().find((s) => s.track?.kind === "video");
          if (senderAfter && camTrack) senderAfter.replaceTrack(camTrack);
          if (localVideoRef.current) localVideoRef.current.srcObject = camStream;
        }).catch(() => {});
      };
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  // Recording local stream (downloads locally)
  const startRecording = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream | null;
    if (!stream) {
      console.warn("No local stream available to record.");
      return;
    }

    try {
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      recordedChunksRef.current = [];

      mr.ondataavailable = (ev: BlobEvent) => {
        if (ev.data && ev.data.size > 0) recordedChunksRef.current.push(ev.data);
      };

      mr.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "session-recording.webm";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        recordedChunksRef.current = [];
      };

      mr.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    } catch (err) {
      console.error("Error stopping recording:", err);
    } finally {
      setIsRecording(false);
    }
  };

  const hangUp = () => {
    try {
      peerConnectionRef.current?.getSenders().forEach((s) => s.track?.stop());
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;
      socketRef.current?.emit("leave-room", roomId);
      setIsCallActive(false);
    } catch (err) {
      console.error("Error hanging up:", err);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl">
      <h2 className="text-lg mb-2">VoIP Video Call</h2>

      <div className="flex gap-4 mb-4">
        <video ref={localVideoRef} autoPlay muted playsInline className="w-1/2 rounded-lg border" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-1/2 rounded-lg border" />
      </div>

      <div className="flex gap-2">
        {!isCallActive ? (
          <button onClick={startCall} className="px-4 py-2 bg-green-600 rounded-lg">Start Call</button>
        ) : (
          <button onClick={hangUp} className="px-4 py-2 bg-red-600 rounded-lg">Hang Up</button>
        )}

        <button onClick={startScreenShare} className="px-4 py-2 bg-blue-600 rounded-lg">Share Screen</button>

        {!isRecording ? (
          <button onClick={startRecording} className="px-4 py-2 bg-green-500 rounded-lg">Start Recording</button>
        ) : (
          <button onClick={stopRecording} className="px-4 py-2 bg-red-500 rounded-lg">Stop Recording</button>
        )}
      </div>
    </div>
  );
}
