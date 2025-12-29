import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.userIconContainer}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Welcome Back!</Text>
              <Text style={styles.userName}>John Doe</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Notifications');
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="#1A1A1A" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Digital Banking Card */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bankingCard}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.chipContainer}>
                <View style={styles.chip}>
                  <View style={styles.chipLines}>
                    <View style={styles.chipLine} />
                    <View style={styles.chipLine} />
                    <View style={styles.chipLine} />
                    <View style={styles.chipLine} />
                  </View>
                </View>
              </View>
              <View style={styles.cardBrand}>
                <Ionicons name="card" size={32} color="#FFFFFF" />
              </View>
            </View>

            {/* Card Number */}
            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumber}>••••  ••••  ••••  1234</Text>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.cardInfo}>
                <View>
                  <Text style={styles.cardLabel}>CARDHOLDER</Text>
                  <Text style={styles.cardValue}>JOHN DOE</Text>
                </View>
                <View style={styles.expiryContainer}>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>12/25</Text>
                </View>
              </View>
              <View style={styles.cardBalance}>
                <Text style={styles.balanceLabel}>Balance</Text>
                <Text style={styles.balanceAmount}>$0.00</Text>
              </View>
            </View>

            {/* Decorative Elements */}
            <View style={styles.cardDecoration}>
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('AddExpense');
              }}
            >
              <View style={[styles.actionIcon, styles.addIcon]}>
                <Ionicons name="remove-circle" size={24} color="#EF4444" />
              </View>
              <Text style={styles.actionText}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('AddIncome');
              }}
            >
              <View style={[styles.actionIcon, styles.incomeIcon]}>
                <Ionicons name="add-circle" size={24} color="#10B981" />
              </View>
              <Text style={styles.actionText}>Add Income</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Budget');
              }}
            >
              <View style={[styles.actionIcon, styles.budgetIcon]}>
                <Ionicons name="stats-chart" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Set Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                // @ts-ignore
                navigation.navigate('Categories');
              }}
            >
              <View style={[styles.actionIcon, styles.categoryIcon]}>
                <Ionicons name="grid" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.actionText}>Categories</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.navigate('ExpensesList');
              }}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No transactions yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start by adding your first expense or income
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bankingCard: {
    borderRadius: 20,
    padding: 24,
    minHeight: 220,
    overflow: 'hidden',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  chipContainer: {
    width: 50,
    height: 40,
  },
  chip: {
    width: 50,
    height: 40,
    backgroundColor: '#FFD700',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipLines: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  chipLine: {
    height: 2,
    backgroundColor: '#FFA500',
    width: '80%',
    borderRadius: 1,
  },
  cardBrand: {
    opacity: 0.9,
  },
  cardNumberContainer: {
    marginBottom: 24,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 4,
    fontFamily: 'monospace',
  },
  cardFooter: {
    marginTop: 'auto',
  },
  cardInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    opacity: 0.7,
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 1,
  },
  expiryContainer: {
    alignItems: 'flex-end',
  },
  cardBalance: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 16,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardDecoration: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addIcon: {
    backgroundColor: '#FEF2F2',
  },
  incomeIcon: {
    backgroundColor: '#F0FDF4',
  },
  budgetIcon: {
    backgroundColor: '#F0F4FF',
  },
  categoryIcon: {
    backgroundColor: '#F3E8FF',
  },
  actionText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

