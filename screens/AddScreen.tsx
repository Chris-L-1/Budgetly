import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadTransactions, saveTransactions } from '../utils/storage';
import { Transaction, TransactionType } from '../types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../constants/categories';
import { useTheme } from '../context/ThemeContext';

export default function AddScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState('Salary');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Missing Info', 'Please enter a description');
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    };

    const existing = await loadTransactions();
    await saveTransactions([newTransaction, ...existing]);

    setDescription('');
    setAmount('');
    setType('income');
    setCategory(INCOME_CATEGORIES[0]);

    Alert.alert('Success! 🎉', 'Transaction added successfully', [
      { text: 'OK', onPress: () => navigation.navigate('Home' as never) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>

        <View style={[styles.toggleRow, { borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'income' && { backgroundColor: colors.income }]}
            onPress={() => handleTypeChange('income')}
          >
            <Text style={[styles.toggleText, { color: type === 'income' ? '#fff' : colors.subText }]}>
              🔥 Income
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, type === 'expense' && { backgroundColor: colors.expense }]}
            onPress={() => handleTypeChange('expense')}
          >
            <Text style={[styles.toggleText, { color: type === 'expense' ? '#fff' : colors.subText }]}>
              💸 Expense
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>

          <Text style={[styles.label, { color: colors.subText }]}>Description</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
            placeholder="e.g. Monthly Salary"
            placeholderTextColor={colors.subText}
            value={description}
            onChangeText={setDescription}
          />

          <Text style={[styles.label, { color: colors.subText }]}>Amount (R)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
            placeholder="e.g. 5000"
            placeholderTextColor={colors.subText}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: colors.subText }]}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryBtn,
                  { borderColor: colors.border, backgroundColor: colors.input },
                  category === cat && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  { color: colors.subText },
                  category === cat && { color: '#ffffff', fontWeight: '600' },
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitText}>Add Transaction</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleText: { fontSize: 15, fontWeight: '600' },
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryText: { fontSize: 13 },
  submitBtn: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});