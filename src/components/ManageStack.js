import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManageScreen from './ManageScreen';
import DataPlan from './Plandetail';
import UspromoScreen from './Uspromo';
import DataPlanScreen from './Packeges';
const Stack = createNativeStackNavigator();

export default function ManageStack() {
  return (
    <Stack.Navigator 
      initialRouteName="ManageMain"
      screenOptions={{ 
        headerShown: false,
      }}>
      <Stack.Screen name="ManageMain" component={ManageScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="ManageScreen" component={ManageScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="DataPlan" component={DataPlan} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="DataPlanScreen" component={DataPlanScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="UspromoScreen" component={UspromoScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}
