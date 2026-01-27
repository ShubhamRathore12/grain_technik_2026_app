import { useI18n } from '@/i18n';
import { useThemeTokens } from '@/providers/theme';
import { Link } from 'expo-router';
import { Globe, Mail, MapPin, Phone } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ContactScreen() {
  const { t } = useI18n();
  const theme = useThemeTokens();
  
  const styles = createStyles(theme);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>{t('contact_us') || 'Contact Us'}</Text>
        
        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Mail size={24} color={theme.colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.label}>{t('email') || 'Email'}</Text>
              <Text style={styles.value}>info@graintechnik.com</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Phone size={24} color={theme.colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.label}>{t('phone') || 'Phone'}</Text>
              <Text style={styles.value}>+1 (555) 123-4567</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <MapPin size={24} color={theme.colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.label}>{t('address') || 'Address'}</Text>
              <Text style={styles.value}>123 Grain Street, Tech City</Text>
            </View>
          </View>
          
          <View style={styles.contactItem}>
            <Globe size={24} color={theme.colors.primary} />
            <View style={styles.contactInfo}>
              <Text style={styles.label}>{t('website') || 'Website'}</Text>
              <Link href="https://www.graintechnik.com" style={styles.link}>
                www.graintechnik.com
              </Link>
            </View>
          </View>
        </View>
        
        <Text style={styles.description}>
          {t('contact_description') || 'Feel free to reach out to us for any inquiries, support, or business opportunities.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  contactCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  contactInfo: {
    marginLeft: 15,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  link: {
    fontSize: 16,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});