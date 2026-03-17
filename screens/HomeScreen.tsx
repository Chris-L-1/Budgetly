import React from 'react';
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
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const data = await loadTransactions();
        setTransactions(data);
      };
      fetchData();
    }, [])
  );

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={styles.cardsRow}>
          <SummaryCard title="Total Income" amount={totalIncome} type="income" />
          <SummaryCard title="Expenses" amount={totalExpense} type="expense" />
          <SummaryCard title="Balance" amount={balance} type="balance" />
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Transactions
          </Text>

          {recent.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: colors.subText }]}>
                No transactions yet
              </Text>
              <Text style={[styles.emptySubText, { color: colors.subText }]}>
                Tap Add to record your first transaction
              </Text>
            </View>
          ) : (
            recent.map(t => (
              <View key={t.id} style={[styles.recentItem, { borderBottomColor: colors.border }]}>
                <View style={styles.recentLeft}>
                  <Text style={styles.recentEmoji}>
                    {t.type === 'income' ? '🟢' : '🔴'}
                  </Text>
                  <View>
                    <Text style={[styles.recentDesc, { color: colors.text }]}>
                      {t.description}
                    </Text>
                    <Text style={[styles.recentCat, { color: colors.subText }]}>
                      {t.category}
                    </Text>
                  </View>
                </View>
                <Text style={{
                  fontWeight: 'bold',
                  color: t.type === 'income' ? colors.income : colors.expense,
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
  container: { flex: 1 },
  scroll: { padding: 16 },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  section: {
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
    marginBottom: 14,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  recentEmoji: { fontSize: 18, marginRight: 10 },
  recentDesc: { fontSize: 14, fontWeight: '600' },
  recentCat: { fontSize: 12, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  emptySubText: { fontSize: 13, marginTop: 6 },
});