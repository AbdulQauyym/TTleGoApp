import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scaleSize } from '../utils/dimensions';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';

import HomeStack from './HomeStack';
import ManageStack from './ManageStack';
import CartStack from './CartStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { language } = useLanguage();
  const t = (key) => translate(language, key);
  const iconSize = scaleSize(24);
  
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Manage') {
            iconName = focused ? 'folder' : 'folder-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarActiveTintColor: '#D7261E',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: scaleSize(60),
          paddingBottom: scaleSize(8),
          paddingTop: scaleSize(8),
        },
        tabBarLabelStyle: {
          fontSize: scaleSize(12),
        },
      })}>
      <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: t('tabs.home') }} />
      <Tab.Screen name="Manage" component={ManageStack} options={{ tabBarLabel: t('tabs.manage') }} />
      <Tab.Screen name="Cart" component={CartStack} options={{ tabBarLabel: t('tabs.cart') }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ tabBarLabel: t('tabs.profile') }} />
    </Tab.Navigator>
  );
}
