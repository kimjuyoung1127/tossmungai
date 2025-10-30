import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Paragraph } from '@toss/tds-react-native';

interface TrustMetricProps {
  title: string; // Title of the metric
  value: string; // Value of the metric
  description: string; // Short description
  index: number; // To manage spacing
}

const TrustMetric: React.FC<TrustMetricProps> = ({ title, value, description, index }) => {
  return (
    <View style={[styles.container, index > 0 ? styles.spacedContainer : null]}>
      <View style={styles.metricRow}>
        <Paragraph typo="body1" weight="bold" style={styles.title}>
          {title}
        </Paragraph>
        <Paragraph typo="headline2" weight="bold" style={styles.value}>
          {value}
        </Paragraph>
        <Paragraph typo="body2" color="#888" style={styles.description}>
          {description}
        </Paragraph>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  spacedContainer: {
    marginTop: 16,
  },
  metricRow: {
    padding: 12,
    backgroundColor: '#F8F9FA', // Match Toss style
    borderRadius: 8,
  },
  title: {
    marginBottom: 4,
  },
  value: {
    marginBottom: 2,
  },
  description: {
    marginTop: 2,
  },
});

export default TrustMetric;