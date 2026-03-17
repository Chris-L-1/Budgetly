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
import { useTheme } from '../context/ThemeContext';

type FilterType = 'all' | TransactionType;

export default function HistoryScreen() {
  const { colors } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

      <View style={styles.filterRow}>
        {(['all', 'income', 'expense'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterBtn,
              { backgroundColor: colors.card, borderColor: colors.border },
              filter === f && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[
              styles.filterText,
              { color: colors.subText },
              filter === f && { color: '#ffffff' },
            ]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.countText, { color: colors.subText }]}>
        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
      </Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.subText }]}>
              No transactions found
            </Text>
            <Text style={[styles.emptySubText, { color: colors.subText }]}>
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
  container: { flex: 1 },
  filterRow: { flexDirection: 'row', padding: 16, gap: 10 },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  filterText: { fontSize: 14, fontWeight: '600' },
  countText: { paddingHorizontal: 16, paddingBottom: 8, fontSize: 13 },
  scroll: { padding: 16, paddingTop: 4 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubText: { fontSize: 13, marginTop: 6, textAlign: 'center' },
});