import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const { colors } = useTheme();
  const isIncome = transaction.type === 'income';

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.left}>
        <Text style={styles.emoji}>{isIncome ? '🟢' : '🔴'}</Text>
        <View>
          <Text style={[styles.description, { color: colors.text }]}>
            {transaction.description}
          </Text>
          <Text style={[styles.category, { color: colors.subText }]}>
            {transaction.category} • {transaction.date}
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
          {isIncome ? '+' : '-'} R {transaction.amount.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={() => onDelete(transaction.id)}>
          <Text style={styles.delete}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  emoji: { fontSize: 20, marginRight: 10 },
  description: { fontSize: 15, fontWeight: '600' },
  category: { fontSize: 12, marginTop: 3 },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 15, fontWeight: 'bold' },
  delete: { fontSize: 18 },
});

export default TransactionItem;
