import { useState, useCallback, useRef, useEffect } from 'react';
import { VADPipeline } from '../lib/vadPipeline';

interface UseVADOptions {
  onUtterance: (wavBuffer: ArrayBuffer, durationMs: number) => void;
}

export function useVAD({ onUtterance }: UseVADOptions) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const vadPipelineRef = useRef<VADPipeline | null>(null);

  const start = useCallback(async (stream: MediaStream): Promise<boolean> => {
    try {
      if (!vadPipelineRef.current) {
        vadPipelineRef.current = new VADPipeline({
          onSpeechStart: () => setIsSpeaking(true),
          onSpeechEnd: () => setIsSpeaking(false),
          onUtterance: (buffer, duration) => onUtterance(buffer, duration),
          onMisfire: () => setIsSpeaking(false),
        });
      }
      
      await vadPipelineRef.current.start(stream);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error starting VAD:', err);
      setError('Failed to initialize voice activity detection.');
      setIsSpeaking(false);
      return false;
    }
  }, [onUtterance]);

  const stop = useCallback(() => {
    if (vadPipelineRef.current) {
      vadPipelineRef.current.destroy();
      vadPipelineRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    start,
    stop,
    isSpeaking,
    error
  };
}
