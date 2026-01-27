import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import LoadingScreen from '@/components/loading-screen';
import SplashScreen from '@/components/splash-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { I18nProvider } from '@/i18n';
import { AuthProvider, useAuth } from '@/providers/auth';
import { ThemeProviderCustom, useThemeMode } from '@/providers/theme';

export const unstable_settings = {
  anchor: '(auth)',
};

function AppStack() {
  const { isAuthenticated, loading } = useAuth();
  const { effective } = useThemeMode();
  const [showSplash, setShowSplash] = useState(true);

  // Hide splash if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setShowSplash(false);
    }
  }, [isAuthenticated]);

  // Show splash screen first (but only if not authenticated)
  if (showSplash && !isAuthenticated) {
    return <SplashScreen onAnimationFinish={() => setShowSplash(false)} />;
  }

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen />;
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

export default function RootLayout() {
  useColorScheme();
  return (
    <I18nProvider>
      <ThemeProviderCustom>
        <AuthProvider>
          <AppStack />
        </AuthProvider>
      </ThemeProviderCustom>
    </I18nProvider>
  );
}