import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

interface MiniChartProps {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function MiniChart({ 
  data = [40, 42, 38, 45, 48, 44, 50, 52, 49, 55, 58, 54, 60, 62, 58, 65, 68, 64, 70, 72],
  color = colors.sage,
  width = 120,
  height = 40,
}: MiniChartProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((val - min) / range) * (height * 0.8) - height * 0.1,
  }));

  // Create smooth bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
    pathD += ` C ${cpx1} ${prev.y} ${cpx2} ${curr.y} ${curr.x} ${curr.y}`;
  }

  // Fill path
  const fillD = pathD + ` L ${width} ${height} L 0 ${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.15" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </SvgGradient>
      </Defs>
      <Path d={fillD} fill="url(#chartGrad)" />
      <Path d={pathD} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  backgroundColor?: string;
  height?: number;
}

export function ProgressBar({ progress, color = colors.sage, backgroundColor = colors.softCard, height = 6 }: ProgressBarProps) {
  return (
    <View style={[styles.progressBg, { backgroundColor, height, borderRadius: height / 2 }]}>
      <View style={[styles.progressFill, { backgroundColor: color, width: `${Math.min(progress * 100, 100)}%`, height, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBg: {
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
