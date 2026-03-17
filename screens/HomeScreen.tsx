import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadTransactions } from '../utils/storage';
import { Transaction } from '../types';
import SummaryCard from '../components/SummaryCard';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Reload data every time screen is visited
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const data = await loadTransactions();
        setTransactions(data);
      };
      fetchData();
    }, [])
  );

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // Get 3 most recent transactions
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Summary Cards */}
        <View style={styles.cardsRow}>
          <SummaryCard title="Total Income" amount={totalIncome} type="income" />
          <SummaryCard title="Expenses" amount={totalExpense} type="expense" />
          <SummaryCard title="Balance" amount={balance} type="balance" />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          {recent.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <Text style={styles.emptySubText}>
                Tap Add to record your first transaction
              </Text>
            </View>
          ) : (
            recent.map(t => (
              <View key={t.id} style={styles.recentItem}>
                <View style={styles.recentLeft}>
                  <Text style={styles.recentEmoji}>
                    {t.type === 'income' ? '🟢' : '🔴'}
                  </Text>
                  <View>
                    <Text style={styles.recentDesc}>{t.description}</Text>
                    <Text style={styles.recentCat}>{t.category}</Text>
                  </View>
                </View>
                <Text style={{
                  fontWeight: 'bold',
                  color: t.type === 'income' ? '#2ecc71' : '#e74c3c',
                }}>
                  {t.type === 'income' ? '+' : '-'} R {t.amount.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
  },
  scroll: {
    padding: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 14,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentEmoji: {
    fontSize: 18,
    marginRight: 10,
  },
  recentDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  recentCat: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 30,
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
  },
});
