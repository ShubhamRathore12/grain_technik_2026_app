import { useThemeTokens } from '@/providers/theme';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface AnimatedToggleProps {
  value: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const AnimatedToggle: React.FC<AnimatedToggleProps> = ({
  value,
  onToggle,
  size = 'medium',
  disabled = false
}) => {
  const translateX = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);
  
  const tokens = useThemeTokens();

  const getDimensions = () => {
    if (size === 'small') return { width: 40, height: 20, thumbSize: 16 };
    if (size === 'large') return { width: 60, height: 30, thumbSize: 26 };
    return { width: 50, height: 25, thumbSize: 20 }; // medium
  };

  const { width, height, thumbSize } = getDimensions();

  const trackStyle = {
    width,
    height,
    borderRadius: height / 2,
    backgroundColor: value ? tokens.colors.success : tokens.colors.textSecondary,
    padding: 2,
  };

  const thumbStyle = {
    width: thumbSize,
    height: thumbSize,
    borderRadius: thumbSize / 2,
    backgroundColor: tokens.colors.surface,
  };

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value * (width - thumbSize - 4),
        },
      ],
    };
  });

  const animatedScaleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    if (disabled) return;
    
    // Animation effect
    scale.value = withSpring(0.9, { damping: 10, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    });
    
    translateX.value = withSpring(value ? 0 : 1, { damping: 15, stiffness: 200 });
    onToggle();
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[trackStyle, { opacity: disabled ? 0.5 : 1 }]}>
        <Animated.View style={[thumbStyle, animatedThumbStyle, animatedScaleStyle]} />
      </View>
    </TouchableOpacity>
  );
};

export default AnimatedToggle;