import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Paragraph } from '@toss/tds-react-native';

interface TrustCardProps {
  review: string;
  rating: number; // Number of stars (1-5)
  reviewer: string; // Optional reviewer name or info
  index: number; // To manage spacing
}

const TrustCard: React.FC<TrustCardProps> = ({ review, rating, reviewer, index }) => {
  // Create star rating display
  const renderStars = () => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? '★' : '☆';
    }
    return (
      <Paragraph typo="body1" style={styles.stars}>
        {stars}
      </Paragraph>
    );
  };

  return (
    <View style={[styles.container, index > 0 ? styles.spacedContainer : null]}>
      <Card type="boxed">
        {renderStars()}
        <Paragraph typo="body2" style={styles.review} italic>
          {review}
        </Paragraph>
        {reviewer && (
          <Paragraph typo="body3" color="#888" style={styles.reviewer} align="right">
            {reviewer}
          </Paragraph>
        )}
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
  stars: {
    marginBottom: 8,
  },
  review: {
    marginBottom: 8,
  },
  reviewer: {
    marginTop: 8,
  },
});

export default TrustCard;