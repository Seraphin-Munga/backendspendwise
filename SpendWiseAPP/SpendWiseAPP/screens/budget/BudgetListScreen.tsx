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
import type { Budget } from './types';

const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food',
    categoryIcon: 'restaurant',
    categoryColor: '#EF4444',
    amount: 500,
    spent: 320,
    period: 'monthly',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 31),
  },
  {
    id: '2',
    category: 'Transport',
    categoryIcon: 'car',
    categoryColor: '#3B82F6',
    amount: 200,
    spent: 180,
    period: 'monthly',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 31),
  },
  {
    id: '3',
    category: 'Shopping',
    categoryIcon: 'bag',
    categoryColor: '#8B5CF6',
    amount: 300,
    spent: 450,
    period: 'monthly',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 31),
  },
  {
    id: '4',
    category: 'Entertainment',
    categoryIcon: 'musical-notes',
    categoryColor: '#EC4899',
    amount: 150,
    spent: 120,
    period: 'monthly',
    startDate: new Date(2024, 0, 1),
    endDate: new Date(2024, 0, 31),
  },
];

export default function BudgetListScreen() {
  const navigation = useNavigation();
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);

  const calculateProgress = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    const remaining = budget.amount - budget.spent;
    const isOverBudget = budget.spent > budget.amount;
    return { percentage: Math.min(percentage, 100), remaining, isOverBudget };
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatPeriod = (period: string) => {
    return period.charAt(0).toUpperCase() + period.slice(1);
  };

  const renderBudgetItem = ({ item }: { item: Budget }) => {
    const progress = calculateProgress(item);
    const progressColor = progress.isOverBudget ? '#EF4444' : item.categoryColor || '#10B981';

    return (
      <TouchableOpacity style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View style={styles.budgetCategory}>
            <View
              style={[
                styles.categoryIconContainer,
                { backgroundColor: `${item.categoryColor || '#10B981'}15` },
              ]}
            >
              <Ionicons
                name={(item.categoryIcon || 'ellipse') as any}
                size={24}
                color={item.categoryColor || '#10B981'}
              />
            </View>
            <View style={styles.budgetInfo}>
              <Text style={styles.budgetCategoryName}>{item.category}</Text>
              <Text style={styles.budgetPeriod}>{formatPeriod(item.period)}</Text>
            </View>
          </View>
          <View style={styles.budgetAmounts}>
            <Text style={styles.spentAmount}>
              {formatCurrency(item.spent)}
            </Text>
            <Text style={styles.budgetAmount}>
              of {formatCurrency(item.amount)}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(progress.percentage, 100)}%`,
                  backgroundColor: progressColor,
                },
              ]}
            />
          </View>
          <View style={styles.progressInfo}>
            <Text
              style={[
                styles.progressPercentage,
                { color: progressColor },
              ]}
            >
              {progress.percentage.toFixed(0)}%
            </Text>
            <Text
              style={[
                styles.remainingAmount,
                progress.isOverBudget && styles.overBudgetText,
              ]}
            >
              {progress.isOverBudget
                ? `Over by ${formatCurrency(Math.abs(progress.remaining))}`
                : `${formatCurrency(progress.remaining)} left`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Budgets</Text>
          <Text style={styles.headerSubtitle}>
            {budgets.length} {budgets.length === 1 ? 'budget' : 'budgets'} active
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('AddBudget');
          }}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <LinearGradient
          colors={['#3B82F6', '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryGradient}
        >
          <Text style={styles.summaryLabel}>Total Budget</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalBudget)}</Text>
          <View style={styles.summaryDetails}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Spent</Text>
              <Text style={styles.summaryItemValue}>
                {formatCurrency(totalSpent)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryItemLabel}>Remaining</Text>
              <Text
                style={[
                  styles.summaryItemValue,
                  totalRemaining < 0 && styles.overBudgetText,
                ]}
              >
                {formatCurrency(totalRemaining)}
              </Text>
            </View>
          </View>
          <View style={styles.overallProgressContainer}>
            <View style={styles.overallProgressBar}>
              <View
                style={[
                  styles.overallProgressFill,
                  {
                    width: `${Math.min(overallPercentage, 100)}%`,
                    backgroundColor:
                      overallPercentage > 100 ? '#EF4444' : '#FFFFFF',
                  },
                ]}
              />
            </View>
            <Text style={styles.overallProgressText}>
              {overallPercentage.toFixed(0)}% used
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="wallet-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No budgets yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create a budget to start tracking your spending
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('AddBudget');
            }}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.emptyStateButtonText}>Create Budget</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={budgets}
          renderItem={renderBudgetItem}
          keyExtractor={(item) => item.id}
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
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryGradient: {
    padding: 24,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  summaryItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  overallProgressContainer: {
    marginTop: 8,
  },
  overallProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
    paddingTop: 16,
  },
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  budgetCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetCategoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  budgetPeriod: {
    fontSize: 12,
    color: '#666666',
  },
  budgetAmounts: {
    alignItems: 'flex-end',
  },
  spentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  budgetAmount: {
    fontSize: 12,
    color: '#666666',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  remainingAmount: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  overBudgetText: {
    color: '#EF4444',
    fontWeight: '600',
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



