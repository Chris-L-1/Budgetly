import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadTransactions, deleteTransaction } from '../utils/storage';
import { Transaction, TransactionType } from '../types';
import TransactionItem from '../components/TransactionItem';

type FilterType = 'all' | TransactionType;

export default function HistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const data = await loadTransactions();
        setTransactions(data);
      };
      fetchData();
    }, [])
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteTransaction(id);
            setTransactions(updated);
          },
        },
      ]
    );
  };

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  return (
    <SafeAreaView style={styles.container}>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {(['all', 'income', 'expense'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction Count */}
      <Text style={styles.countText}>
        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
      </Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubText}>
              {filter === 'all'
                ? 'Tap Add to record your first transaction'
                : `No ${filter} transactions yet`}
            </Text>
          </View>
        ) : (
          filtered.map(t => (
            <TransactionItem
              key={t.id}
              transaction={t}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  filterRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterBtnActive: {
    backgroundColor: '#2980b9',
    borderColor: '#2980b9',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  countText: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 13,
    color: '#888',
  },
  scroll: {
    padding: 16,
    paddingTop: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 6,
    textAlign: 'center',
  },
});
