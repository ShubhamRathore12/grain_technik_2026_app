import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { MaskedView } from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

interface ThemedTextProps extends TextProps {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  gradientColors?: string[];
}

export function ThemedText({ 
  style, 
  type = 'default',
  gradientColors,
  children,
  ...rest 
}: ThemedTextProps) {
  const textStyle = [
    styles.default,
    type === 'default' ? styles.default : undefined,
    type === 'title' ? styles.title : undefined,
    type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
    type === 'subtitle' ? styles.subtitle : undefined,
    type === 'link' ? styles.link : undefined,
    style,
  ];

  if (gradientColors && gradientColors.length > 0) {
    return (
      <MaskedView
        maskElement={<Text style={textStyle} {...rest}>{children}</Text>}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </MaskedView>
    );
  }

  return (
    <Text style={textStyle} {...rest}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    color: '#0a7ea4',
  },
});