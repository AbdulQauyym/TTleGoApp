import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import HelpCenterScreen from './HelpCenter';
import OrderHistoryScreen from './OrderHistory';
import InviteFriendsScreen from './Invitefriend';
import AboutScreen from './About';
import ContactUsScreen from './ContactUs';
import LiveChatScreen from './LiveChat';
import OtherIssueScreen from './OtherIssue';
import NetworkSpeedScreen from './NetworkSpeed';
import TermsAndConditionsScreen from './TermsAndConditions';
import FAQScreen from './FAQScreen';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator 
      initialRouteName="ProfileMain"
      screenOptions={{ 
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="LiveChatScreen" component={LiveChatScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="OtherIssueScreen" component={OtherIssueScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="NetworkSpeedScreen" component={NetworkSpeedScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="InviteFriendsScreen" component={InviteFriendsScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

