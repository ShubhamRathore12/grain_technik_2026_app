import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { I18nProvider } from '@/i18n';
import { AuthProvider, useAuth } from '@/providers/auth';
import { ThemeProviderCustom, useThemeMode } from '@/providers/theme';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

// Simple splash component
function SplashComponent() {
  const { effective } = useThemeMode();
  return (
    <View style={[
      styles.splashContainer,
      { backgroundColor: effective === 'dark' ? '#0f172a' : '#f8fafc' }
    ]}>
      <Text style={[
        styles.splashText,
        { color: effective === 'dark' ? '#f1f5f9' : '#0f172a' }
      ]}>
        Grain Technik
      </Text>
    </View>
  );
}

function AppStack() {
  const { isAuthenticated, loading } = useAuth();
  const { effective } = useThemeMode();

  // Show splash while checking auth status
  if (loading) {
    return <SplashComponent />;
  }

  return (
    <ThemeProvider value={effective === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Show auth stack when NOT authenticated
          <Stack.Screen name="(auth)" />
        ) : (
          // Show main app when authenticated
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="menu"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="contact"
              options={{
                headerShown: true,
                title: 'Contact'
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Modal'
              }}
            />
          </>
        )}
      </Stack>
      <StatusBar style={effective === 'dark' ? 'light' : 'dark'} />
      <Toast />
    </ThemeProvider>
  );
}

// Wrapper with simple splash
function AppWithSplash() {
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (splashVisible) {
    return <SplashComponent />;
  }

  return <AppStack />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default function RootLayout() {
  useColorScheme();
  return (
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProviderCustom>
          <AuthProvider>
            <AppWithSplash />
          </AuthProvider>
        </ThemeProviderCustom>
      </I18nProvider>
    </ErrorBoundary>
  );
}
