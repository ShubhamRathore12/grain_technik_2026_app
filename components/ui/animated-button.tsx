import { useThemeTokens } from '@/providers/theme';
import React from 'react';
import { GestureResponderEvent, StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface AnimatedButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  activeOpacity?: number;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  children,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  activeOpacity = 0.7
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const tokens = useThemeTokens();

  const getVariantStyles = () => {
    const baseStyle: ViewStyle = {
      borderRadius: tokens.radius.medium,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    };

    const variantStyle: ViewStyle = {
      ...tokens.elevation.medium,
      backgroundColor: disabled ? tokens.colors.textSecondary : tokens.colors.primary,
    };

    if (variant === 'secondary') {
      variantStyle.backgroundColor = tokens.colors.secondary;
    } else if (variant === 'outline') {
      variantStyle.backgroundColor = 'transparent';
      variantStyle.borderWidth = 1;
      variantStyle.borderColor = tokens.colors.border;
    } else if (variant === 'ghost') {
      variantStyle.backgroundColor = 'transparent';
      variantStyle.borderWidth = 0;
    }

    return [baseStyle, variantStyle];
  };

  const getSizeStyles = () => {
    const sizeStyle: ViewStyle = {};
    
    if (size === 'small') {
      sizeStyle.paddingHorizontal = tokens.spacing.sm;
      sizeStyle.paddingVertical = tokens.spacing.xs;
    } else if (size === 'large') {
      sizeStyle.paddingHorizontal = tokens.spacing.lg;
      sizeStyle.paddingVertical = tokens.spacing.md;
    } else { // medium
      sizeStyle.paddingHorizontal = tokens.spacing.md;
      sizeStyle.paddingVertical = tokens.spacing.sm;
    }
    
    return sizeStyle;
  };

  const getTextColor = () => {
    if (disabled) return tokens.colors.textSecondary;
    if (variant === 'outline' || variant === 'ghost') return tokens.colors.text;
    return tokens.colors.surface;
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(activeOpacity, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  return (
    <Animated.View style={[animatedStyle, getVariantStyles(), getSizeStyles(), style]}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {children ? (
          <>{children}</>
        ) : (
          <Text
            style={[
              {
                color: getTextColor(),
                fontSize: size === 'small' ? tokens.typography.caption.fontSize : tokens.typography.body.fontSize,
                fontWeight: '600',
                textAlign: 'center',
              },
              textStyle
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AnimatedButton;