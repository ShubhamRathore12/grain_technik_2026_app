import { useI18n } from '@/i18n';
import { useAuth } from '@/providers/auth';
import { useThemeMode } from '@/providers/theme';
import { lightHaptic, mediumHaptic } from '@/utils/haptic-utils';
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
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';

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

    // Haptic feedback on button press
    mediumHaptic();

    try {
      console.log('Login attempt starting...');
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      console.log('Calling login with credentials:', { username: trimmedUsername });
      await login({ username: trimmedUsername, password: trimmedPassword });
      console.log('Login successful, navigating to devices');
      
      // Navigate to devices page
      router.replace('/(tabs)/devices');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'Invalid username or password',
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
      {/* Simple Background */}
      <View style={[
        styles.background,
        { backgroundColor: effective === 'dark' ? '#0f172a' : '#f8fafc' }
      ]} />

      {/* Header with controls */}
      <View style={styles.header}>
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[styles.iconButton, effective === 'dark' && styles.iconButtonDark]}
            onPress={() => {
              lightHaptic();
              setMode(mode === 'dark' ? 'light' : 'dark');
            }}
          >
            {mode === 'dark' ? (
              <Sun size={IconSize} color={iconColor} />
            ) : (
              <Moon size={IconSize} color={iconColor} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, effective === 'dark' && styles.iconButtonDark]}
            onPress={() => {
              lightHaptic();
              setLocale(locale === 'en' ? 'de' : 'en');
            }}
          >
            <Globe size={IconSize} color={iconColor} />
            <Text style={[styles.localeText, { color: iconColor }]}>
              {locale.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>

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
              autoComplete="username"
              textContentType="username"
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
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
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
      </View>
    </View>
  );
}

