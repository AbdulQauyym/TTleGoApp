import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/components/SplashScreen';
import WelcomeScreen from './src/components/Welcom';
import MainTabs from './src/components/MainTabs';
import LoginScreen from './src/components/Loginpage';
import SignUpScreen from './src/components/Signup';
import ForgetPasswordScreen from './src/components/ForgetPassword';

const Stack = createNativeStackNavigator();

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          {this.state.error && (
            <Text style={styles.errorDetail}>{this.state.error.toString()}</Text>
          )}
        </View>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  try {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="ForgetPasswordScreen" component={ForgetPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    console.error('AppContent error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>App initialization error: {error.message}</Text>
      </View>
    );
  }
}

export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    console.log('App component mounted');
    // Small delay to ensure React Native is ready
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CC0000',
  },
  errorText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  errorDetail: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 10,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CC0000',
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
