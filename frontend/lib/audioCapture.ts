/**
 * Audio capture utility for extracting audio from screen sharing.
 *
 * Uses MediaRecorder to capture audio from a getDisplayMedia stream.
 * Each chunk is a self-contained audio file by stopping and restarting
 * the recorder for every interval, ensuring Whisper can decode each
 * chunk independently.
 */

export interface AudioCaptureOptions {
  /** Callback invoked with each audio chunk as an ArrayBuffer */
  onAudioChunk: (chunk: ArrayBuffer) => void;
  /** Interval in ms between audio chunk emissions. Default: 3000 */
  chunkInterval?: number;
}

export class AudioCapture {
  private audioStream: MediaStream | null = null;
  private options: AudioCaptureOptions;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isCapturing = false;
  private mimeType: string = "audio/webm";

  constructor(options: AudioCaptureOptions) {
    this.options = options;
  }

  /**
   * Start capturing audio from the given display media stream.
   * The stream must have at least one audio track.
   */
  start(stream: MediaStream): boolean {
    const audioTracks = stream.getAudioTracks();

    if (audioTracks.length === 0) {
      console.warn("No audio tracks found in the stream. Make sure to check 'Share tab audio' when sharing.");
      return false;
    }

    // Create an audio-only stream
    this.audioStream = new MediaStream(audioTracks);
    this.mimeType = this.getSupportedMimeType();
    this.isCapturing = true;

    // Record in short bursts — each burst produces a self-contained file
    const interval = this.options.chunkInterval || 3000;
    this.recordOneChunk(); // Start the first recording immediately
    this.intervalId = setInterval(() => {
      if (this.isCapturing) {
        this.recordOneChunk();
      }
    }, interval);

    return true;
  }

  /**
   * Record a single short chunk. Each call creates a new MediaRecorder,
   * records for a short duration, and produces a complete audio file.
   */
  private recordOneChunk(): void {
    if (!this.audioStream || !this.isCapturing) return;

    // Check the tracks are still alive
    const liveTracks = this.audioStream.getAudioTracks().filter(t => t.readyState === "live");
    if (liveTracks.length === 0) {
      console.warn("Audio tracks ended, stopping capture.");
      this.stop();
      return;
    }

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(this.audioStream, {
        mimeType: this.mimeType,
        audioBitsPerSecond: 128000,
      });
    } catch {
      recorder = new MediaRecorder(this.audioStream);
    }

    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = async () => {
      if (chunks.length > 0) {
        const blob = new Blob(chunks, { type: this.mimeType });
        const buffer = await blob.arrayBuffer();
        if (buffer.byteLength > 0) {
          this.options.onAudioChunk(buffer);
        }
      }
    };

    recorder.start();

    // Stop after a short recording window (slightly less than the interval)
    const recordDuration = (this.options.chunkInterval || 3000) - 200;
    setTimeout(() => {
      if (recorder.state === "recording") {
        recorder.stop();
      }
    }, Math.max(recordDuration, 1000));
  }

  /** Stop capturing audio. */
  stop(): void {
    this.isCapturing = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop());
      this.audioStream = null;
    }
  }

  /** Check if currently recording. */
  isRecording(): boolean {
    return this.isCapturing;
  }

  private getSupportedMimeType(): string {
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "audio/webm";
  }
}

/**
 * Request screen sharing with audio.
 * Returns the MediaStream or null if user cancelled.
 */
export async function requestScreenShare(): Promise<MediaStream | null> {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
    return stream;
  } catch (error) {
    if ((error as Error).name === "NotAllowedError") {
      // User cancelled the share dialog
      return null;
    }
    console.error("Screen share error:", error);
    return null;
  }
}
