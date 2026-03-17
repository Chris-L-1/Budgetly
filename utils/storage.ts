import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '../types';

const STORAGE_KEY = 'budgetly_transactions';

// Save all transactions to phone storage
export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    const json = JSON.stringify(transactions);
    await AsyncStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

// Load all transactions from phone storage
export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

// Delete a single transaction by its ID
export const deleteTransaction = async (id: string): Promise<Transaction[]> => {
  try {
    const transactions = await loadTransactions();
    const updated = transactions.filter(t => t.id !== id);
    await saveTransactions(updated);
    return updated;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return [];
  }
};