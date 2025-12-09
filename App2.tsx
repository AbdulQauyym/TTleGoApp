/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, ScrollView, Image, Text, TouchableHighlight, useWindowDimensions } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// Import internal components using require to avoid TypeScript errors
const Links = require('@react-native/new-app-screen/src/Links').default;
const {ThemedText, useTheme} = require('@react-native/new-app-screen/src/Theme');
const ReactNativeVersion = require('react-native').ReactNativeVersion;
const openURLInBrowser = require('react-native/Libraries/Core/Devtools/openURLInBrowser').default;

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const {colors} = useTheme();
  const isDarkMode = useColorScheme() === 'dark';
  const isLargeScreen = useWindowDimensions().width > 600;

  return (
    <View
      style={{
        backgroundColor: '#2196F3',
        paddingTop: safeAreaInsets.top,
        paddingLeft: safeAreaInsets.left,
        paddingRight: safeAreaInsets.right,
      }}>
      <ScrollView style={{paddingBottom: safeAreaInsets.bottom}}>
        <View style={customStyles.container}>
          <View style={customStyles.header}>
            <Image
              style={customStyles.logo}
              source={
                isDarkMode
                  ? require('@react-native/new-app-screen/src/assets/react-dark.png')
                  : require('@react-native/new-app-screen/src/assets/react-light.png')
              }
            />
            <ThemedText style={customStyles.title}>
              Welcome to React Native
            </ThemedText>
            <ThemedText color="secondary" style={customStyles.label}>
              Version: {ReactNativeVersion.getVersionString()}
            </ThemedText>
            {/* @ts-ignore */}
            {global.HermesInternal != null && (
              <ThemedText color="secondary" style={customStyles.label}>
                JS Engine: Hermes
              </ThemedText>
            )}
            <ThemedText
              style={[
                customStyles.callout,
                {backgroundColor: colors.backgroundHighlight},
              ]}>
              💡&ensp;Open{' '}
              <Text style={customStyles.calloutEmphasis}>App.tsx</Text> to
              get started
            </ThemedText>
          </View>
          <View style={customStyles.linksContainer}>
            <ThemedText style={customStyles.linksTitle}>Hi Qauyym sabir</ThemedText>
            {Links.map(({title, description, url}: any, i: number) => (
              <TouchableHighlight
                key={i}
                activeOpacity={0.6}
                underlayColor={colors.background}
                onPress={() => openURLInBrowser(url)}
                style={[
                  customStyles.link,
                  {
                    maxWidth: isLargeScreen ? 240 : 360,
                    borderColor: colors.cardOutline,
                    backgroundColor: colors.cardBackground,
                  },
                ]}>
                <View>
                  <ThemedText style={customStyles.linkText}>{title}</ThemedText>
                  <ThemedText style={{color: colors.textSecondary}}>
                    {description}
                  </ThemedText>
                </View>
              </TouchableHighlight>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const customStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginTop: 64,
    marginBottom: 48,
  },
  logo: {
    height: 80,
    aspectRatio: 1,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  callout: {
    width: '100%',
    maxWidth: 320,
    marginTop: 36,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingLeft: 16,
    borderRadius: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  calloutEmphasis: {
    fontWeight: 'bold',
  },
  linksContainer: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 12,
    rowGap: 12,
    maxWidth: 800,
    marginBottom: 48,
  },
  linksTitle: {
    width: '100%',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  link: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
  },
  linkText: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
