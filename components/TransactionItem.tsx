import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '../types';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === 'income';

  return (
    <View style={styles.container}>

      {/* Left side — emoji + details */}
      <View style={styles.left}>
        <Text style={styles.emoji}>{isIncome ? '🟢' : '🔴'}</Text>
        <View>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={styles.category}>{transaction.category} • {transaction.date}</Text>
        </View>
      </View>

      {/* Right side — amount + delete */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: isIncome ? '#2ecc71' : '#e74c3c' }]}>
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
    backgroundColor: '#ffffff',
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
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  emoji: {
    fontSize: 20,
    marginRight: 10,
  },
  description: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  category: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  delete: {
    fontSize: 18,
  },
});

export default TransactionItem;

