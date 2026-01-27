import { useThemeTokens } from '@/providers/theme';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: 'low' | 'medium' | 'high';
  borderRadius?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  initialScale?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  elevation = 'medium',
  borderRadius = 'medium',
  animated = true,
  initialScale = 0.8
}) => {
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);
  
  const tokens = useThemeTokens();

  const cardStyle: ViewStyle = {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius[borderRadius],
    margin: tokens.spacing.md,
    overflow: 'hidden',
    ...tokens.elevation[elevation],
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  React.useEffect(() => {
    if (animated) {
      setTimeout(() => {
        scale.value = withSpring(1, { 
          damping: 12, 
          stiffness: 150 
        });
        opacity.value = withTiming(1, { duration: 300 });
      }, 100); // Small delay to allow for mounting
    } else {
      scale.value = 1;
      opacity.value = 1;
    }
  }, []);

  return (
    <Animated.View style={[cardStyle, animated ? animatedStyle : {}, style]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedCard;