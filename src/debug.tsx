// src/debug.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AnimatedGlow, { PresetConfig } from './AnimatedGlow';
import { useFpsRecorder } from './hooks/useFpsRecorder';

type TestResult = {
  orbs: number;
  fps: number;
};

// A self-contained, un-themed graph component with the corrected layout.
const PerformanceGraph = ({ data, title, subtitle }: { data: TestResult[], title: string, subtitle: string }) => {
    if (!data || data.length === 0) return null;
    const maxFps = Math.max(...data.map(d => d.fps), 60);
    const Y_AXIS_TICKS = 5;
    const MAX_X_AXIS_LABELS = 10;
    const labelStride = data.length > MAX_X_AXIS_LABELS ? Math.ceil(data.length / MAX_X_AXIS_LABELS) : 1;
    const yAxisLabels = Array.from({ length: Y_AXIS_TICKS + 1 }, (_, i) => Math.round((maxFps / Y_AXIS_TICKS) * i));
    return (
      <View style={graphStyles.graphContainer}>
        <Text style={graphStyles.title}>{title}</Text>
        <Text style={graphStyles.subtitle}>{subtitle}</Text>
        <View style={graphStyles.graphLayout}>
          <View style={graphStyles.yAxisContainer}>
            {yAxisLabels.reverse().map(label => (
              <Text key={label} style={graphStyles.yAxisLabel}>{label} -</Text>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <View style={graphStyles.graph}>
              {data.map((result, index) => (
                <View key={index} style={graphStyles.barWrapper}>
                  <View style={[graphStyles.bar, { height: `${(result.fps / maxFps) * 100}%`, backgroundColor: result.fps > 50 ? '#4CAF50' : result.fps > 25 ? '#FFC107' : '#F44336' }]}>
                    <Text style={graphStyles.barValue}>{result.fps}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={graphStyles.xAxisRow}>
              {data.map((result, index) => (
                <View key={index} style={graphStyles.xAxisLabelCell}>
                  {index % labelStride === 0 && (
                    <Text style={graphStyles.barLabel}>{result.orbs}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
};
  
const defaultGetPresetForOrbs = (orbCount: number): PresetConfig => ({
  cornerRadius: 20,
  outlineWidth: 2,
  borderColor: 'white',
  backgroundColor: '#222',
  glowLayers: [{
    colors: ['#00FFFF', '#FF00FF', '#FFFF00'],
    numberOfOrbs: orbCount,
    opacity: 0.5,
    dotSize: 75,
  }],
});

interface GlowDebuggerProps {
  getPresetForOrbs?: (orbCount: number) => PresetConfig;
  maxOrbs?: number;
  step?: number;
  numberOfComponents?: number;
}

export const GlowDebugger = ({
  getPresetForOrbs,
  maxOrbs = 500,
  step = 20,
  numberOfComponents = 1,
}: GlowDebuggerProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentOrbCount, setCurrentOrbCount] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [statusMessage, setStatusMessage] = useState('Press "Start Test" to begin.');
  const presetGenerator = getPresetForOrbs || defaultGetPresetForOrbs;
  const { getAverage, reset } = useFpsRecorder(isRecording);

  const runTest = async () => {
    setResults([]);
    setCurrentOrbCount(0);
    reset();
    setStatusMessage('Starting test...');
    setIsRecording(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    const steps: number[] = [];
    for (let i = step; i <= maxOrbs; i += step) steps.push(i);
    for (const orbs of steps) {
      setStatusMessage(`Testing with ${orbs} total orbs...`);
      setCurrentOrbCount(orbs);
      reset();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const avgFps = getAverage();
      setResults(prev => [...prev, { orbs, fps: avgFps }]);
    }
    setStatusMessage('Test complete!');
    setIsRecording(false);
    setCurrentOrbCount(0);
  };

  return (
    <View style={styles.debuggerContainer}>
      <View style={styles.testArea}>
        {Array.from({ length: numberOfComponents }).map((_, i) => (
           <AnimatedGlow key={i} preset={presetGenerator(currentOrbCount / numberOfComponents)}>
            <View style={styles.box} />
          </AnimatedGlow>
        ))}
      </View>
      <TouchableOpacity style={[styles.button, { backgroundColor: isRecording ? '#555' : '#007AFF' }]} onPress={runTest} disabled={isRecording}>
        <Text style={styles.buttonText}>{isRecording ? 'Test in Progress...' : 'Start Test'}</Text>
      </TouchableOpacity>
      <Text style={styles.statusText}>{statusMessage}</Text>
      <PerformanceGraph data={results} title="Performance Results" subtitle="FPS vs. Total Orb Count" />
    </View>
  );
};

// Component-specific styles
const styles = StyleSheet.create({ debuggerContainer: { width: '100%', alignItems: 'center', paddingVertical: 20 }, testArea: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', minHeight: 120, marginVertical: 30, alignItems: 'center' }, box: { width: 80, height: 80, backgroundColor: '#222' }, button: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8, alignItems: 'center' }, buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 }, statusText: { marginTop: 15, fontStyle: 'italic', textAlign: 'center', color: '#888' } });

// Graph-specific styles
const graphStyles = StyleSheet.create({
  graphContainer: { width: '100%', maxWidth: 800, marginTop: 40, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 4, color: '#333' },
  subtitle: { fontSize: 14, fontStyle: 'italic', marginBottom: 16, color: '#666' },
  graphLayout: { width: '100%', flexDirection: 'row', marginTop: 10 },
  yAxisContainer: { height: 300, justifyContent: 'space-between', paddingRight: 8 },
  yAxisLabel: { fontSize: 12, textAlign: 'right', color: '#999' },
  graph: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', height: 300, borderLeftWidth: 1, borderBottomWidth: 1, paddingTop: 10, borderColor: '#ccc' },
  barWrapper: { flex: 1, alignItems: 'center', height: '100%', paddingHorizontal: 2, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4, justifyContent: 'flex-start', alignItems: 'center', overflow: 'hidden' },
  barValue: { paddingTop: 4, color: 'white', fontSize: 10, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  xAxisRow: { flexDirection: 'row', height: 20, marginTop: 4, borderLeftWidth: 1, borderColor: '#ccc' },
  xAxisLabelCell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  barLabel: { fontSize: 10, color: '#999' },
});