import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
];

export default function LanguageSelectionScreen({ navigation }) {
  const { language, changeLanguage } = useLanguage();
  const t = (key) => translate(language, key);

  const handleLanguageSelect = async (langCode) => {
    await changeLanguage(langCode);
    // Optionally navigate back
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('language.selectLanguage')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.currentLanguageText}>
          {t('language.currentLanguage')}: {languages.find(l => l.code === language)?.nativeName}
        </Text>

        <View style={styles.languagesList}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageItem,
                language === lang.code && styles.languageItemActive,
              ]}
              onPress={() => handleLanguageSelect(lang.code)}
            >
              <View style={styles.languageContent}>
                <View style={styles.languageInfo}>
                  <Text style={[
                    styles.languageName,
                    language === lang.code && styles.languageNameActive,
                  ]}>
                    {lang.nativeName}
                  </Text>
                  <Text style={[
                    styles.languageCode,
                    language === lang.code && styles.languageCodeActive,
                  ]}>
                    {lang.name}
                  </Text>
                </View>
                {language === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color="#CC0000" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            {t('language.infoText')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  currentLanguageText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  languagesList: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  languageItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  languageItemActive: {
    backgroundColor: '#FFF5F5',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  languageNameActive: {
    color: '#CC0000',
  },
  languageCode: {
    fontSize: 14,
    color: '#666',
  },
  languageCodeActive: {
    color: '#CC0000',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    lineHeight: 18,
  },
});

