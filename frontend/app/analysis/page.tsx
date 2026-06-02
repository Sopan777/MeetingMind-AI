"use client";

import { useCallback, useRef, useState } from "react";
import { MeetingTopBar } from "@/components/MeetingTopBar";
import { SharedScreenPanel } from "@/components/SharedScreenPanel";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { InsightsPanels } from "@/components/InsightsPanels";
import { LiveSummaryPanel } from "@/components/LiveSummaryPanel";
import { useMeetingAnalysis } from "@/hooks/useMeetingAnalysis";
import { AudioCapture, requestScreenShare } from "@/lib/audioCapture";

export default function AnalysisPage() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioWarning, setAudioWarning] = useState<string | null>(null);

  const audioCaptureRef = useRef<AudioCapture | null>(null);

  const {
    status,
    transcript,
    insights,
    connect,
    disconnect,
    sendAudio,
  } = useMeetingAnalysis();

  const handleShareScreen = useCallback(async () => {
    setAudioWarning(null);
    const mediaStream = await requestScreenShare();

    if (!mediaStream) return;

    setStream(mediaStream);
    setIsSharing(true);

    // Listen for the user stopping the share via browser UI
    mediaStream.getVideoTracks()[0]?.addEventListener("ended", () => {
      handleStopSharing();
    });

    // Check if audio is available
    const audioTracks = mediaStream.getAudioTracks();
    if (audioTracks.length === 0) {
      setAudioWarning(
        "No audio detected. When sharing, make sure to check \"Share tab audio\" or \"Share system audio\" in the browser dialog."
      );
    }
  }, []);

  const handleStopSharing = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsSharing(false);
    setAudioWarning(null);

    // Also stop analysis if it was running
    if (isAnalyzing) {
      handleStopAnalysis();
    }
  }, [stream, isAnalyzing]);

  const handleStartAnalysis = useCallback(() => {
    if (!stream) return;

    // Connect WebSocket
    connect();

    // Start audio capture
    const capture = new AudioCapture({
      onAudioChunk: (chunk) => {
        sendAudio(chunk);
      },
      chunkInterval: 2000,
    });

    const started = capture.start(stream);

    if (!started) {
      setAudioWarning(
        "Could not start audio capture. Make sure to check \"Share tab audio\" when sharing your screen."
      );
      return;
    }

    audioCaptureRef.current = capture;
    setIsAnalyzing(true);
  }, [stream, connect, sendAudio]);

  const handleStopAnalysis = useCallback(() => {
    // Stop audio capture
    if (audioCaptureRef.current) {
      audioCaptureRef.current.stop();
      audioCaptureRef.current = null;
    }

    // Disconnect WebSocket
    disconnect();
    setIsAnalyzing(false);
  }, [disconnect]);

  return (
    <div className="flex flex-col h-screen">
      <MeetingTopBar
        status={isAnalyzing ? status : isSharing ? "connected" : "ready"}
        isSharing={isSharing}
        isAnalyzing={isAnalyzing}
        onShareScreen={handleShareScreen}
        onStopSharing={handleStopSharing}
        onStartAnalysis={handleStartAnalysis}
        onStopAnalysis={handleStopAnalysis}
      />

      {/* Audio warning */}
      {audioWarning && (
        <div className="bg-yellow-900/30 border-b border-yellow-700/50 px-6 py-2.5 text-sm text-yellow-200 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          {audioWarning}
          <button
            onClick={() => setAudioWarning(null)}
            className="ml-auto text-yellow-400 hover:text-yellow-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Screen preview */}
        <SharedScreenPanel stream={stream} />

        {/* Transcript */}
        <TranscriptPanel segments={transcript} />

        {/* Insights */}
        <InsightsPanels
          actionItems={insights.action_items}
          decisions={insights.decisions}
          risks={insights.risks}
        />

        {/* Summary */}
        <LiveSummaryPanel summary={insights.summary} />
      </div>
    </div>
  );
}
