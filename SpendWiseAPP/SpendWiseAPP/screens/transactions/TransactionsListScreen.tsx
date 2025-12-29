import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Transaction } from './types';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    title: 'Grocery Shopping',
    amount: 85.50,
    category: 'Food',
    categoryIcon: 'restaurant',
    categoryColor: '#EF4444',
    date: new Date(),
    description: 'Weekly groceries',
  },
  {
    id: '2',
    type: 'income',
    title: 'Salary',
    amount: 3000,
    category: 'Salary',
    categoryIcon: 'cash',
    categoryColor: '#10B981',
    date: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    type: 'expense',
    title: 'Uber Ride',
    amount: 25.00,
    category: 'Transport',
    categoryIcon: 'car',
    categoryColor: '#3B82F6',
    date: new Date(Date.now() - 172800000),
  },
  {
    id: '4',
    type: 'expense',
    title: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    categoryIcon: 'musical-notes',
    categoryColor: '#EC4899',
    date: new Date(Date.now() - 259200000),
  },
  {
    id: '5',
    type: 'income',
    title: 'Freelance Work',
    amount: 500,
    category: 'Work',
    categoryIcon: 'briefcase',
    categoryColor: '#10B981',
    date: new Date(Date.now() - 345600000),
  },
  {
    id: '6',
    type: 'expense',
    title: 'Electricity Bill',
    amount: 120.00,
    category: 'Bills',
    categoryIcon: 'receipt',
    categoryColor: '#F59E0B',
    date: new Date(Date.now() - 432000000),
  },
];

export default function TransactionsListScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: new Date(date).getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach((transaction) => {
      const dateKey = formatDate(transaction.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      transactions: items,
    }));
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const renderTransactionItem = (item: Transaction) => {
    const isIncome = item.type === 'income';
    const iconColor = item.categoryColor || (isIncome ? '#10B981' : '#EF4444');

    return (
      <TouchableOpacity style={styles.transactionItem}>
        <View
          style={[
            styles.categoryIconContainer,
            { backgroundColor: `${iconColor}15` },
          ]}
        >
          <Ionicons
            name={(item.categoryIcon || (isIncome ? 'add-circle' : 'remove-circle')) as any}
            size={24}
            color={iconColor}
          />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text
            style={[
              styles.transactionAmount,
              isIncome ? styles.incomeAmount : styles.expenseAmount,
            ]}
          >
            {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateGroup = ({ item }: { item: { date: string; transactions: Transaction[] } }) => {
    return (
      <View style={styles.dateGroup}>
        <Text style={styles.dateHeader}>{item.date}</Text>
        {item.transactions.map((transaction) => (
          <View key={transaction.id}>
            {renderTransactionItem(transaction)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSubtitle}>
            {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('AddTransaction');
          }}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.summaryContainer}
      >
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['#10B981', '#34D399']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryGradient}
          >
            <View style={styles.summaryIconContainer}>
              <Ionicons name="arrow-down-circle" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(totalIncome)}</Text>
          </LinearGradient>
        </View>

        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['#EF4444', '#F87171']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryGradient}
          >
            <View style={styles.summaryIconContainer}>
              <Ionicons name="arrow-up-circle" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(totalExpenses)}</Text>
          </LinearGradient>
        </View>

        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryGradient}
          >
            <View style={styles.summaryIconContainer}>
              <Ionicons name="wallet" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(balance)}</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterTabText,
              filter === 'all' && styles.filterTabTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'income' && styles.filterTabActive]}
          onPress={() => setFilter('income')}
        >
          <Ionicons
            name="arrow-down"
            size={16}
            color={filter === 'income' ? '#10B981' : '#666666'}
          />
          <Text
            style={[
              styles.filterTabText,
              filter === 'income' && styles.filterTabTextActive,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'expense' && styles.filterTabActive]}
          onPress={() => setFilter('expense')}
        >
          <Ionicons
            name="arrow-up"
            size={16}
            color={filter === 'expense' ? '#EF4444' : '#666666'}
          />
          <Text
            style={[
              styles.filterTabText,
              filter === 'expense' && styles.filterTabTextActive,
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No transactions</Text>
          <Text style={styles.emptyStateSubtext}>
            {filter === 'all'
              ? 'Start by adding your first transaction'
              : `No ${filter} transactions found`}
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('AddTransaction');
            }}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={groupedTransactions}
          renderItem={renderDateGroup}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  summaryCard: {
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryGradient: {
    padding: 20,
    minHeight: 140,
  },
  summaryIconContainer: {
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#666666',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  incomeAmount: {
    color: '#10B981',
  },
  expenseAmount: {
    color: '#EF4444',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});



