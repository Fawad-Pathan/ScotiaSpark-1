import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

type LogoProps = {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: number;
  style?: any;
};

export function Logo({ variant = 'full', size = 24, style }: LogoProps) {
  if (variant === 'mark') {
    return (
      <Image
        source={require('../../assets/logos/spark-logo.jpeg')}
        style={[{ width: size, height: size, borderRadius: size / 4 }, style]}
      />
    );
  }
  if (variant === 'wordmark') {
    return (
      <Text style={[styles.wordmark, { fontSize: size }, style]}>
        Scotia Spark
      </Text>
    );
  }
  return (
    <View style={[styles.full, style]}>
      <Image
        source={require('../../assets/logos/spark-logo.jpeg')}
        style={{ width: size, height: size, borderRadius: size / 4 }}
      />
      <Text style={[styles.wordmark, { fontSize: size * 0.9 }]}>
        Scotia Spark
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wordmark: {
    fontFamily: 'LibreBaskerville_400Regular',
    color: colors.ink,
  },
});
