import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

type SplashScreenProps = {
  onAnimationFinish?: () => void;
};

export default function SplashScreen({ onAnimationFinish }: SplashScreenProps) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    // Fade in and scale up animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 2,
        tension: 30,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Call the callback when animation is done
      if (onAnimationFinish) {
        onAnimationFinish();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            width: width * 0.8,
          }
        ]}
      >
        <Text style={styles.title}>Grain Technik</Text>
        <Text style={styles.subtitle}>App by ProSafe Automation</Text>
        <View style={styles.loadingContainer}>
          <Animated.View 
            style={[
              styles.loadingBar,
              {
                width: width * 0.6,
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 1, 1],
                }),
                transform: [
                  {
                    scaleX: fadeAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.1, 0.5, 1],
                    })
                  }
                ]
              }
            ]} 
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
  },
  logoContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingContainer: {
    marginTop: 20,
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
});
