import React from 'react';
import { View } from 'react-native';

// Optional layout component for onboarding routes
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>;
}