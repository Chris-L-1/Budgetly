import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type }) => {
  const getAmountColor = () => {
    if (type === 'income') return '#2ecc71';
    if (type === 'expense') return '#e74c3c';
    return '#2980b9';
  };

  const getEmoji = () => {
    if (type === 'income') return '🔥';
    if (type === 'expense') return '💸';
    return '📊';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{getEmoji()}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.amount, { color: getAmountColor() }]}>
        R {amount.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SummaryCard;
