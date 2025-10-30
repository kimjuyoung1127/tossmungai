import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Paragraph } from '@toss/tds-react-native';

interface ValueCardProps {
  title: string;
  description: string;
  index: number; // To manage spacing and styling based on position
}

const ValueCard: React.FC<ValueCardProps> = ({ title, description, index }) => {
  return (
    <View style={[styles.container, index > 0 ? styles.spacedContainer : null]}>
      <Card type="boxed">
        <Paragraph typo="body1" weight="bold">
          {title}
        </Paragraph>
        <Paragraph typo="body2" color="#666" style={styles.description}>
          {description}
        </Paragraph>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  spacedContainer: {
    marginTop: 12,
  },
  description: {
    marginTop: 4,
  },
});

export default ValueCard;