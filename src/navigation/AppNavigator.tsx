import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDemo } from '../store/DemoContext';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { hasOnboarded } = useDemo();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainTabs} />
      )}
    </Stack.Navigator>
  );
}
