import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, radii, typography } from '../theme';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'pill';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function Button({ title, onPress, variant = 'primary', style, textStyle, disabled }: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'pill' && styles.pill,
        variant === 'tertiary' && styles.tertiary,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[
        styles.text,
        variant === 'primary' && styles.primaryText,
        variant === 'secondary' && styles.secondaryText,
        variant === 'pill' && styles.pillText,
        variant === 'tertiary' && styles.tertiaryText,
        textStyle,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.button,
  },
  primary: {
    backgroundColor: colors.scotiaRed,
  },
  secondary: {
    backgroundColor: colors.transparent,
    borderWidth: 0.5,
    borderColor: colors.primaryText,
  },
  pill: {
    backgroundColor: colors.transparent,
    borderWidth: 0.5,
    borderColor: colors.cardBorder,
    borderRadius: radii.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tertiary: {
    backgroundColor: colors.transparent,
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.primaryText,
  },
  pillText: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  tertiaryText: {
    color: colors.secondaryText,
  },
});
