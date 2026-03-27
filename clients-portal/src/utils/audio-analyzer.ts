import MusicTempo from "music-tempo";
import Meyda from "meyda";

const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];
const PITCH_CLASSES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * Calculates Pearson correlation coefficient between two arrays
 */
function pearsonCorrelation(x: number[], y: number[]) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  if (denominator === 0) return 0;
  return numerator / denominator;
}

export async function analyzeAudio(file: File): Promise<{ bpm: string; key: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // Use an OfflineAudioContext to decode the audio
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        
        const audioData = audioBuffer.getChannelData(0); // Use left channel

        // 1. BPM DETECTION with music-tempo
        const mt = new MusicTempo(audioData);
        const bpm = Math.round(mt.tempo).toString() + " BPM";

        // 2. KEY DETECTION with Meyda Chromagram
        const bufferSize = 4096;
        Meyda.bufferSize = bufferSize;
        Meyda.sampleRate = audioBuffer.sampleRate;

        // We will average the chromagram over the entire song by sampling periodically
        const totalChroma = new Array(12).fill(0);
        let chromaSamples = 0;

        // Sample every 4096 frames (skip some to optimize performance, maybe try testing a slice every 10 * bufferSize)
        for (let i = 0; i < audioData.length - bufferSize; i += bufferSize * 10) {
          const slice = audioData.slice(i, i + bufferSize);
          const features = Meyda.extract("chroma", slice);
          if (features) {
            // Meyda features usually return an object, but chroma returns number[]
            const chromaData = features as unknown as number[];
            for (let j = 0; j < 12; j++) {
               totalChroma[j] += chromaData[j];
            }
            chromaSamples++;
          }
        }

        const avgChroma = totalChroma.map((v) => v / Math.max(1, chromaSamples));

        // Correlate against 24 profiles (12 major, 12 minor)
        let bestScore = -Infinity;
        let bestKey = "Unknown";

        for (let root = 0; root < 12; root++) {
          // Shift the average chroma to match the root
          const shiftedChroma = [];
          for (let i = 0; i < 12; i++) {
            shiftedChroma.push(avgChroma[(i + root) % 12]);
          }

          const majorScore = pearsonCorrelation(shiftedChroma, MAJOR_PROFILE);
          if (majorScore > bestScore) {
            bestScore = majorScore;
            bestKey = `${PITCH_CLASSES[root]} Maj`;
          }

          const minorScore = pearsonCorrelation(shiftedChroma, MINOR_PROFILE);
          if (minorScore > bestScore) {
            bestScore = minorScore;
            bestKey = `${PITCH_CLASSES[root]} Min`;
          }
        }

        resolve({ bpm, key: bestKey });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
