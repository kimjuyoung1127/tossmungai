import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { Text, View } from 'react-native';

export const Route = createRoute('/about', {
  component: AboutPage,
});

function AboutPage() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>About Page</Text>
    </View>
  );
}
