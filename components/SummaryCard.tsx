import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type }) => {
  const { colors } = useTheme();

  const getAmountColor = () => {
    if (type === 'income') return colors.income;
    if (type === 'expense') return colors.expense;
    return colors.primary;
  };

  const getEmoji = () => {
    if (type === 'income') return '🔥';
    if (type === 'expense') return '💸';
    return '📊';
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <Text style={styles.emoji}>{getEmoji()}</Text>
      <Text style={[styles.title, { color: colors.subText }]}>{title}</Text>
      <Text style={[styles.amount, { color: getAmountColor() }]}>
        R {amount.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
    marginBottom: 10,
    textAlign: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SummaryCard;