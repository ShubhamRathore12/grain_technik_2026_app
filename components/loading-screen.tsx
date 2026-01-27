import React, { useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Text 
} from 'react-native';
import { useThemeMode } from '@/providers/theme';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const { effective } = useThemeMode();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[
      styles.container, 
      { backgroundColor: effective === 'dark' ? '#0f172a' : '#f8fafc' }
    ]}>
      <Animated.View style={[
        styles.logoContainer,
        { 
          transform: [
            { rotate: spin },
            { scale: pulseAnim }
          ]
        }
      ]}>
        <View style={[
          styles.logo,
          { backgroundColor: effective === 'dark' ? '#1e293b' : '#e2e8f0' }
        ]}>
          <Text style={[
            styles.logoText,
            { color: effective === 'dark' ? '#60a5fa' : '#3b82f6' }
          ]}>
            🔐
          </Text>
        </View>
      </Animated.View>
      
      <Text style={[
        styles.loadingText,
        { color: effective === 'dark' ? '#94a3b8' : '#64748b' }
      ]}>
        Loading...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
});