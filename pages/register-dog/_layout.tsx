import React from 'react';
import { View } from 'react-native';
import { OnboardingProvider } from '@/src/context/OnboardingContext';

// Register dog layout component that wraps all register-dog routes with OnboardingProvider
export default function RegisterDogLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingProvider>
      <View style={{ flex: 1 }}>{children}</View>
    </OnboardingProvider>
  );
}