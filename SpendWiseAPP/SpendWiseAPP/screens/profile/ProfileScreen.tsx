import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { UserProfile, ProfileStat } from './types';

const mockProfile: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  joinDate: new Date(2024, 0, 1),
};

const mockStats: ProfileStat[] = [
  { label: 'Total Transactions', value: 156, icon: 'receipt', color: '#3B82F6' },
  { label: 'Active Budgets', value: 4, icon: 'wallet', color: '#10B981' },
  { label: 'Categories', value: 8, icon: 'grid', color: '#8B5CF6' },
  { label: 'This Month', value: '$2,450', icon: 'calendar', color: '#F59E0B' },
];

const settingsSections = [
  {
    title: 'Account',
    items: [
      { id: '1', label: 'Edit Profile', icon: 'person-outline', color: '#3B82F6', screen: 'EditProfile' },
      { id: '2', label: 'Change Password', icon: 'lock-closed-outline', color: '#6B7280', screen: null },
      { id: '3', label: 'Privacy Settings', icon: 'shield-checkmark-outline', color: '#10B981', screen: null },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: '4', label: 'Notifications', icon: 'notifications-outline', color: '#EC4899', screen: null },
      { id: '5', label: 'Currency', icon: 'cash-outline', color: '#F59E0B', screen: null },
      { id: '6', label: 'Language', icon: 'language-outline', color: '#8B5CF6', screen: null },
      { id: '7', label: 'Theme', icon: 'color-palette-outline', color: '#06B6D4', screen: null },
    ],
  },
  {
    title: 'Data',
    items: [
      { id: '8', label: 'Export Data', icon: 'download-outline', color: '#10B981', screen: null },
      { id: '9', label: 'Backup & Sync', icon: 'cloud-upload-outline', color: '#3B82F6', screen: null },
      { id: '10', label: 'Clear Cache', icon: 'trash-outline', color: '#EF4444', screen: null },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: '11', label: 'Help Center', icon: 'help-circle-outline', color: '#6B7280', screen: null },
      { id: '12', label: 'Contact Us', icon: 'mail-outline', color: '#3B82F6', screen: null },
      { id: '13', label: 'About', icon: 'information-circle-outline', color: '#6B7280', screen: null },
    ],
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profile] = useState<UserProfile>(mockProfile);

  const handleSettingPress = (item: { id: string; label: string; screen?: string | null }) => {
    if (item.screen) {
      // @ts-ignore
      navigation.navigate(item.screen);
    } else {
      Alert.alert('Feature', `${item.label} feature coming soon!`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            Alert.alert('Success', 'Logged out successfully');
          },
        },
      ]
    );
  };

  const formatJoinDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={['#3B82F6', '#60A5FA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#FFFFFF" />
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#3B82F6" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <Text style={styles.profileJoinDate}>
              Member since {formatJoinDate(profile.joinDate)}
            </Text>
          </View>
        </LinearGradient>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          {mockStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.settingsList}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.settingItem}
                  onPress={() => handleSettingPress(item)}
                >
                  <View style={[styles.settingIconContainer, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={styles.settingLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>SpendWise v1.0.0</Text>
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
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  profileJoinDate: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  settingsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginTop: 24,
  },
});
