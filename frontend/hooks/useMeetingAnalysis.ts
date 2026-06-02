"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TranscriptSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

interface ActionItem {
  owner: string;
  task: string;
  deadline: string;
}

interface Decision {
  decision: string;
  timestamp: string;
}

interface Risk {
  description: string;
  timestamp: string;
}

interface MeetingInsights {
  action_items: ActionItem[];
  decisions: Decision[];
  risks: Risk[];
  summary: string;
}

interface UseMeetingAnalysisReturn {
  status: "ready" | "connected" | "recording" | "processing";
  transcript: TranscriptSegment[];
  insights: MeetingInsights;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendAudio: (chunk: ArrayBuffer) => void;
}

const EMPTY_INSIGHTS: MeetingInsights = {
  action_items: [],
  decisions: [],
  risks: [],
  summary: "",
};

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws/analyze";

export function useMeetingAnalysis(): UseMeetingAnalysisReturn {
  const [status, setStatus] = useState<"ready" | "connected" | "recording" | "processing">("ready");
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [insights, setInsights] = useState<MeetingInsights>(EMPTY_INSIGHTS);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setStatus("ready");
  }, []);

  const connect = useCallback(() => {
    cleanup();

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setStatus("connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        switch (msg.type) {
          case "status":
            if (msg.status === "recording" || msg.status === "processing" || msg.status === "connected") {
              setStatus(msg.status);
            }
            break;

          case "transcript":
            setTranscript((prev) => [...prev, msg.data]);
            break;

          case "insights":
            setInsights(msg.data);
            break;

          case "pong":
            // heartbeat response
            break;

          case "error":
            console.error("Server error:", msg.message);
            break;
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setStatus("ready");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }, [cleanup]);

  const disconnect = useCallback(() => {
    cleanup();
    setTranscript([]);
    setInsights(EMPTY_INSIGHTS);
  }, [cleanup]);

  const sendAudio = useCallback((chunk: ArrayBuffer) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(chunk);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Heartbeat
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isConnected]);

  return {
    status,
    transcript,
    insights,
    isConnected,
    connect,
    disconnect,
    sendAudio,
  };
}
