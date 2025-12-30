# Language Support Setup

This app now supports three languages:
- **English** (en)
- **Persian/Farsi** (fa)
- **Pashto** (ps)

## Installation

To enable language persistence (saving selected language), install AsyncStorage:

```bash
npm install @react-native-async-storage/async-storage
```

For iOS, also run:
```bash
cd ios && pod install && cd ..
```

## How It Works

1. **Language Context**: Manages the current language state and persists it using AsyncStorage
2. **Translation Files**: Located in `src/translations/` (en.js, fa.js, ps.js)
3. **Translation Utility**: `src/utils/translations.js` provides the `translate()` function
4. **Language Selection Screen**: `src/components/LanguageSelectionScreen.js` allows users to change language

## Usage

### In Components

```javascript
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

function MyComponent() {
  const { language } = useLanguage();
  const t = (key) => translate(language, key);
  
  return <Text>{t('profile.guest')}</Text>;
}
```

### Adding New Translations

1. Add the key to all three translation files:
   - `src/translations/en.js`
   - `src/translations/fa.js`
   - `src/translations/ps.js`

2. Use nested objects for organization:
```javascript
// en.js
export default {
  profile: {
    guest: 'Guest',
    login: 'Log In',
  },
  home: {
    welcome: 'Welcome',
  },
};
```

3. Access with dot notation: `t('profile.guest')`

## Current Translations

The following screens/components have translations:
- ProfileScreen (all text)
- LanguageSelectionScreen

## Adding Translations to Other Screens

1. Import the hooks:
```javascript
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
```

2. Use in component:
```javascript
const { language } = useLanguage();
const t = (key) => translate(language, key);
```

3. Replace hardcoded text:
```javascript
// Before
<Text>Hello</Text>

// After
<Text>{t('home.hello')}</Text>
```

4. Add translations to all three language files.

## Notes

- If AsyncStorage is not installed, the app will use in-memory storage (language resets on app restart)
- The default language is English
- Language selection is available in Profile Screen → Language (after "About Us")

