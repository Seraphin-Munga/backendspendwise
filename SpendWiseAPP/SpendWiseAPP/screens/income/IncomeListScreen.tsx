import React, { useEffect } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchIncomes } from '../../store/incomeSlice';

export default function IncomeListScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { incomes, isLoading, total } = useAppSelector((state) => state.income);

  useEffect(() => {
    dispatch(fetchIncomes());
  }, [dispatch]);

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  const groupIncomesByDate = (incomes: typeof incomes) => {
    const groups: { [key: string]: typeof incomes } = {};

    incomes.forEach((income) => {
      const dateKey = formatDate(income.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(income);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      incomes: items,
    }));
  };

  const groupedIncomes = groupIncomesByDate(incomes);

  const renderIncomeItem = (item: typeof incomes[0]) => {
    const iconColor = item.categoryColor || '#10B981';

    return (
      <TouchableOpacity style={styles.incomeItem}>
        <View
          style={[
            styles.categoryIconContainer,
            { backgroundColor: `${iconColor}15` },
          ]}
        >
          <Ionicons
            name={(item.categoryIcon || 'add-circle') as any}
            size={24}
            color={iconColor}
          />
        </View>
        <View style={styles.incomeInfo}>
          <Text style={styles.incomeTitle}>{item.title}</Text>
          <Text style={styles.incomeCategory}>{item.category}</Text>
        </View>
        <View style={styles.incomeAmountContainer}>
          <Text style={styles.incomeAmount}>
            +{formatCurrency(item.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateGroup = ({
    item,
  }: {
    item: { date: string; incomes: typeof incomes };
  }) => {
    return (
      <View style={styles.dateGroup}>
        <Text style={styles.dateHeader}>{item.date}</Text>
        {item.incomes.map((income) => (
          <View key={income.id}>{renderIncomeItem(income)}</View>
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
          <Text style={styles.headerTitle}>Income</Text>
          <Text style={styles.headerSubtitle}>
            {total} {total === 1 ? 'income' : 'incomes'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            // @ts-ignore
            navigation.navigate('AddIncome');
          }}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
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
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(totalIncome)}</Text>
        </LinearGradient>
      </View>

      {/* Incomes List */}
      {incomes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="cash-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No income yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start tracking your income by adding your first entry
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('AddIncome');
            }}
          >
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            <Text style={styles.emptyStateButtonText}>Add Income</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={groupedIncomes}
          renderItem={renderDateGroup}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={() => dispatch(fetchIncomes())}
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
    alignItems: 'center',
  },
  summaryIconContainer: {
    marginBottom: 12,
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
  },
  listContent: {
    padding: 20,
    paddingTop: 16,
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
  incomeItem: {
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
  incomeInfo: {
    flex: 1,
  },
  incomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  incomeCategory: {
    fontSize: 12,
    color: '#666666',
  },
  incomeAmountContainer: {
    alignItems: 'flex-end',
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
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



