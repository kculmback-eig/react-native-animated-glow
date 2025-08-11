// src/hooks/useFpsRecorder.ts
import { useEffect, useRef } from 'react';

/**
 * A hook for recording frame rates over a period.
 * @param isRecording - A boolean to start or stop recording frames.
 * @returns An object with methods to get the average FPS and reset the recorder.
 * @internal
 */
export const useFpsRecorder = (isRecording: boolean) => {
  const samples = useRef<number[]>([]);
  const lastTimestamp = useRef(performance.now());
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    // Reset timestamp and samples when recording starts
    lastTimestamp.current = performance.now();
    samples.current = [];

    const loop = (now: number) => {
      const delta = now - lastTimestamp.current;
      lastTimestamp.current = now;

      // Avoid division by zero and extreme deltas on the first frame
      if (delta > 0 && delta < 1000) {
        const currentFps = 1000 / delta;
        samples.current.push(currentFps);
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isRecording]);

  /**
   * Calculates the average FPS from the collected samples, excluding outliers.
   * @returns The rounded average FPS.
   */
  const getAverage = () => {
    if (samples.current.length < 10) return 0; // Not enough data

    // Sort samples to remove top and bottom 10% as outliers
    const sortedSamples = [...samples.current].sort((a, b) => a - b);
    const tenPercent = Math.floor(sortedSamples.length * 0.1);
    const filteredSamples = sortedSamples.slice(tenPercent, sortedSamples.length - tenPercent);

    if (filteredSamples.length === 0) return 0;

    const sum = filteredSamples.reduce((acc, val) => acc + val, 0);
    const average = sum / filteredSamples.length;
    return Math.round(average);
  };

  /**
   * Clears all collected FPS samples.
   */
  const reset = () => {
    samples.current = [];
  };

  return { getAverage, reset };
};