import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from './cart';
import SelectOrderScreen from './SelectOrder';
import YourOrderScreen from './YourOrder';
import DataPlanScreen from './Packeges';

const Stack = createNativeStackNavigator();

export default function CartStack() {
  return (
    <Stack.Navigator 
      initialRouteName="CartMain"
      screenOptions={{ 
        headerShown: false,
      }}>
      <Stack.Screen name="CartMain" component={CartScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="CartScreen" component={CartScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="SelectOrderScreen" component={SelectOrderScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="YourOrderScreen" component={YourOrderScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="DataPlanScreen" component={DataPlanScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}

