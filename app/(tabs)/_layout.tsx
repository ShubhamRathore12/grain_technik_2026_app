import { router, Tabs } from 'expo-router';
import { Cpu, FileText, Globe, LogOut, Moon, Sun, User, UserPlus } from 'lucide-react-native';
import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Locale, useI18n } from '@/i18n';
import { AuthContext } from '@/providers/auth';
import { Mode, useThemeMode } from '@/providers/theme';

// Extracted Header Actions Component
const HeaderActions = ({
  mode,
  setMode,
  locale,
  setLocale,
  onLogout,
  tintColor,
  effective,
  t
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  onLogout: () => void;
  tintColor: string;
  effective: 'light' | 'dark';
  t: (key: string) => string;
}) => {
  const iconSize = 22;

  return (
    <View style={styles.headerActionsContainer}>
      {/* Theme Toggle */}
      <TouchableOpacity
        onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        style={[
          styles.headerButton,
          { backgroundColor: effective === 'dark' ? '#1e293b' : '#f1f5f9' }
        ]}
        accessibilityLabel={t('Toggle theme')}
        accessibilityRole="button"
      >
        {mode === 'dark' ? (
          <Sun size={iconSize} color={tintColor} />
        ) : (
          <Moon size={iconSize} color={tintColor} />
        )}
      </TouchableOpacity>

      {/* Language Toggle */}
      <TouchableOpacity
        onPress={() => setLocale(locale === 'en' ? 'de' : 'en')}
        style={[
          styles.headerButton,
          styles.languageButton,
          { backgroundColor: effective === 'dark' ? '#1e293b' : '#f1f5f9' }
        ]}
        accessibilityLabel={t('Change language')}
        accessibilityRole="button"
      >
        <Globe size={iconSize} color={tintColor} />
        <Text style={[styles.languageText, { color: tintColor }]}>
          {locale.toUpperCase()}
        </Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={onLogout}
        style={[
          styles.headerButton,
          styles.logoutButton,
          { backgroundColor: effective === 'dark' ? '#1e293b' : '#f1f5f9' }
        ]}
        accessibilityLabel={t('Logout')}
        accessibilityRole="button"
      >
        <LogOut size={iconSize} color={tintColor} />
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const auth = useContext(AuthContext);

  if (!auth) {
    return null; // Prevent crash if rendered outside provider
  }

  const { logout } = auth;
  const { t, locale, setLocale } = useI18n();
  const { mode, setMode, effective } = useThemeMode();

  const tintColor = Colors[effective ?? 'light'].tint;
  const tabIconSize = 24;

  // Handle logout with confirmation and proper error handling
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.replace('/(auth)/login');
    }
  };

  return (
    <Tabs
      initialRouteName="devices"
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: effective === 'dark' ? '#94a3b8' : '#64748b',
        headerShown: true,
        tabBarButton: HapticTab,
        headerTitle: t('Grain Technik'),
        headerStyle: {
          backgroundColor: effective === 'dark' ? '#0f172a' : '#ffffff',
        },
        headerTintColor: tintColor,
        tabBarStyle: {
          backgroundColor: effective === 'dark' ? '#0f172a' : '#ffffff',
          borderTopColor: effective === 'dark' ? '#1e293b' : '#e2e8f0',
        },
        headerRight: () => (
          <HeaderActions
            mode={mode}
            setMode={setMode}
            locale={locale}
            setLocale={setLocale}
            onLogout={handleLogout}
            tintColor={tintColor}
            effective={effective}
            t={t}
          />
        ),
      }}
    >
      {/* Devices Tab */}
      <Tabs.Screen
        name="devices"
        options={{
          title: t('devices'),
          tabBarIcon: ({ color }) => (
            <Cpu size={tabIconSize} color={color} />
          ),
          tabBarAccessibilityLabel: t('devices'),
        }}
      />

      {/* Reports Tab */}
      <Tabs.Screen
        name="reports"
        options={{
          title: t('reports'),
          tabBarIcon: ({ color }) => (
            <FileText size={tabIconSize} color={color} />
          ),
          tabBarAccessibilityLabel: t('reports'),
        }}
      />

      {/* Registration Form Tab */}
      <Tabs.Screen
        name="registration-form"
        options={{
          title: t('Registration'),
          tabBarIcon: ({ color }) => (
            <UserPlus size={tabIconSize} color={color} />
          ),
          tabBarAccessibilityLabel: t('Registration'),
        }}
      />

      {/* Contact Tab */}
      <Tabs.Screen
        name="contact"
        options={{
          title: t('Contact'),
          tabBarIcon: ({ color }) => (
            <User size={tabIconSize} color={color} />
          ),
          tabBarAccessibilityLabel: t('Contact'),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerActionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
  },
  languageButton: {
    alignItems: 'center',
  },
  logoutButton: {
    marginRight: 12,
  },
  languageText: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '700',
  },
});