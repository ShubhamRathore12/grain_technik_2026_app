import { useI18n } from '@/i18n';
import { useAuth } from '@/providers/auth';
import { useThemeMode } from '@/providers/theme';
import { useRouter } from 'expo-router';
import {
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Moon,
  Sun,
  User
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const { effective, mode, setMode } = useThemeMode();
  const { locale, setLocale, t } = useI18n();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  const [isValid, setIsValid] = useState(false);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [bgScale] = useState(new Animated.Value(1));
  const [particles] = useState(Array.from({ length: 20 }, () => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * height),
    size: Math.random() * 20 + 10,
    speed: Math.random() * 2 + 1,
  })));

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Background pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgScale, {
          toValue: 1.05,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bgScale, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating particles animation
    particles.forEach((particle) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.y, {
            toValue: Math.random() * height,
            duration: 8000 * particle.speed,
            useNativeDriver: true,
          }),
          Animated.timing(particle.x, {
            toValue: Math.random() * width,
            duration: 8000 * particle.speed,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const validateUsername = (username: string) => {
    // Username validation - at least 3 characters, alphanumeric with underscores/dots
    const usernameRegex = /^[a-zA-Z0-9_.]{3,}$/;
    return usernameRegex.test(username);
  };

  const validatePassword = (password: string) => {
    // Password must be at least 8 characters with at least one uppercase, lowercase, and number
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: ''
    };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (!validateUsername(username)) {
      newErrors.username = 'Username must be at least 3 characters (letters, numbers, _, .)';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 chars with uppercase, lowercase & number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    // Add button press animation
    Animated.sequence([
      Animated.timing(bgScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bgScale, {
        toValue: 1.02,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    try {
      await login({ username, password });
      router.replace('/(tabs)/devices');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'An error occurred during login',
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
      });
    }
  };

  const IconSize = 22;
  const iconColor = effective === 'dark' ? '#e2e8f0' : '#475569';

  return (
    <View style={styles.container}>
      {/* Animated Background */}
      <Animated.View
        style={[
          styles.background,
          {
            transform: [{ scale: bgScale }],
            backgroundColor: effective === 'dark' ? '#0f172a' : '#f8fafc',
          },
        ]}
      >
        {/* Animated Particles */}
        {particles.map((particle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                transform: [
                  { translateX: particle.x },
                  { translateY: particle.y }
                ],
                width: particle.size,
                height: particle.size,
                backgroundColor: effective === 'dark' 
                  ? `rgba(59, 130, 246, ${0.1 + particle.size / 100})`
                  : `rgba(59, 130, 246, ${0.05 + particle.size / 200})`,
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Header with controls */}
      <View style={styles.header}>
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[styles.iconButton, effective === 'dark' && styles.iconButtonDark]}
            onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
          >
            {mode === 'dark' ? (
              <Sun size={IconSize} color={iconColor} />
            ) : (
              <Moon size={IconSize} color={iconColor} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, effective === 'dark' && styles.iconButtonDark]}
            onPress={() => setLocale(locale === 'en' ? 'de' : 'en')}
          >
            <Globe size={IconSize} color={iconColor} />
            <Text style={[styles.localeText, { color: iconColor }]}>
              {locale.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: effective === 'dark' ? '#1e293b' : '#e2e8f0' }]}>
            <Lock size={36} color={effective === 'dark' ? '#60a5fa' : '#3b82f6'} />
          </View>
          <Text style={[styles.title, { color: effective === 'dark' ? '#f1f5f9' : '#0f172a' }]}>
            {t('login_title')}
          </Text>
          <Text style={[styles.subtitle, { color: effective === 'dark' ? '#94a3b8' : '#64748b' }]}>
            {'Welcome back! Please sign in to continue'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Username Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <User size={20} color={effective === 'dark' ? '#94a3b8' : '#64748b'} />
            </View>
            <TextInput
              placeholder={t('username') || 'Username'}
              placeholderTextColor={effective === 'dark' ? '#64748b' : '#94a3b8'}
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  color: effective === 'dark' ? '#f1f5f9' : '#0f172a',
                  backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
                  borderColor: errors.username ? '#ef4444' : (effective === 'dark' ? '#334155' : '#e2e8f0'),
                },
              ]}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                // Clear error when user types
                if (errors.username) {
                  setErrors(prev => ({ ...prev, username: '' }));
                }
              }}
            />
          </View>
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username}</Text>
          ) : null}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Lock size={20} color={effective === 'dark' ? '#94a3b8' : '#64748b'} />
            </View>
            <TextInput
              placeholder={t('password') || 'Password'}
              placeholderTextColor={effective === 'dark' ? '#64748b' : '#94a3b8'}
              secureTextEntry={secure}
              style={[
                styles.input,
                {
                  color: effective === 'dark' ? '#f1f5f9' : '#0f172a',
                  backgroundColor: effective === 'dark' ? '#1e293b' : '#ffffff',
                  borderColor: errors.password ? '#ef4444' : (effective === 'dark' ? '#334155' : '#e2e8f0'),
                },
              ]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                // Clear error when user types
                if (errors.password) {
                  setErrors(prev => ({ ...prev, password: '' }));
                }
              }}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setSecure(!secure)}
            >
              {secure ? (
                <EyeOff size={20} color={effective === 'dark' ? '#94a3b8' : '#64748b'} />
              ) : (
                <Eye size={20} color={effective === 'dark' ? '#94a3b8' : '#64748b'} />
              )}
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.buttonText}>{t('sign_in') || 'Sign In'}</Text>
                <ChevronRight size={20} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>

          {/* Links */}
          {/* <View style={styles.linksContainer}>
            <Link href="/(auth)/registration" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={[styles.linkText, { color: effective === 'dark' ? '#60a5fa' : '#3b82f6' }]}>
                  {t('registering') || 'Create Account'}
                </Text>
              </TouchableOpacity>
            </Link>
            <View style={styles.divider} />
            <Link href="/(auth)/contact" asChild>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={[styles.linkText, { color: effective === 'dark' ? '#60a5fa' : '#3b82f6' }]}>
                  {t('contact_us') || 'Contact Us'}
                </Text>
              </TouchableOpacity>
            </Link>
          </View> */}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: effective === 'dark' ? '#64748b' : '#94a3b8' }]}>
            {t('Prosafe Automation') || '© 2024 Your App. All rights reserved.'}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.4,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconButtonDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  localeText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 52,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 2,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  linkText: {
    fontWeight: '600',
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: '#cbd5e1',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});