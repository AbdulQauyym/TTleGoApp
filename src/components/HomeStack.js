import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './homepage';
import DataPlanScreen from './Packeges';
import CountrySelectScreen from './SearchResult';
import PromoScreen from './PromoScreen';
import DataPlan from './Plandetail';
import UspromoScreen from './Uspromo';
import InviteFriendsScreen from './Invitefriend';
import LoginScreen from './Loginpage';
import SignUpScreen from './Signup';
import YourOrderScreen from './YourOrder';
import RegionalESimsScreen from './RegionalESims';
import GlobalESimsScreen from './GlobalESims';
import LiveChatScreen from './LiveChat';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator 
      initialRouteName="HomeMain"
      screenOptions={{ 
        headerShown: false,
      }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="DataPlanScreen" component={DataPlanScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="CountrySelectScreen" component={CountrySelectScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="PromoScreen" component={PromoScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="UspromoScreen" component={UspromoScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="InviteFriendsScreen" component={InviteFriendsScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="DataPlan" component={DataPlan} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="YourOrderScreen" component={YourOrderScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="RegionalESimsScreen" component={RegionalESimsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="GlobalESimsScreen" component={GlobalESimsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="LiveChatScreen" component={LiveChatScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

