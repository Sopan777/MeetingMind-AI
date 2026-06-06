import { MicVAD } from '@ricky0123/vad-web';
import { encodeWAV } from './wavEncoder';

export interface VADPipelineOptions {
  onUtterance: (wavBuffer: ArrayBuffer, durationMs: number) => void;
  onSpeechStart?: () => void;
  onSpeechEnd?: () => void;
  onMisfire?: () => void;
}

export class VADPipeline {
  private vad: MicVAD | null = null;
  private options: VADPipelineOptions;

  constructor(options: VADPipelineOptions) {
    this.options = options;
  }

  async start(stream: MediaStream): Promise<void> {
    try {
      this.vad = await MicVAD.new({
        getStream: async () => stream,
        resumeStream: async () => stream,
        pauseStream: async () => {},

        // Explicitly point to the static assets we copied to public/
        baseAssetPath: '/',
        onnxWASMBasePath: '/',

        // Fix Next.js dynamic import error by disabling threaded WASM
        ortConfig: (ort) => {
          ort.env.wasm.numThreads = 1;
        },

        // Tuning parameters for meeting transcription
        positiveSpeechThreshold: 0.8,
        negativeSpeechThreshold: 0.3,
        minSpeechFrames: 5,        // Avoid tiny blips
        redemptionFrames: 8,       // Allow small pauses in speech
        preSpeechPadFrames: 3,     // Pad start slightly so we don't clip words
        submitUserSpeechOnPause: true,

        onSpeechStart: () => {
          this.options.onSpeechStart?.();
        },
        onSpeechEnd: (audio: Float32Array) => {
          this.options.onSpeechEnd?.();

          // @ricky0123/vad-web always returns audio as 16kHz float32
          const sampleRate = 16000;
          const wavBuffer = encodeWAV(audio, sampleRate);
          const durationMs = (audio.length / sampleRate) * 1000;

          this.options.onUtterance(wavBuffer, durationMs);
        },
        onVADMisfire: () => {
          this.options.onMisfire?.();
        }
      });
      this.vad.start();
    } catch (err) {
      console.error('Failed to start VAD pipeline', err);
      throw err;
    }
  }

  pause(): void {
    this.vad?.pause();
  }

  resume(): void {
    this.vad?.start();
  }

  destroy(): void {
    if (this.vad) {
      this.vad.destroy();
      this.vad = null;
    }
  }
}
