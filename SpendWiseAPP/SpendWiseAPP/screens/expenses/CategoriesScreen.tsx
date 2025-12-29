import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { ExpenseCategory } from './types';

const defaultCategories: ExpenseCategory[] = [
  { id: '1', name: 'Food', icon: 'restaurant', color: '#EF4444' },
  { id: '2', name: 'Transport', icon: 'car', color: '#3B82F6' },
  { id: '3', name: 'Shopping', icon: 'bag', color: '#8B5CF6' },
  { id: '4', name: 'Bills', icon: 'receipt', color: '#F59E0B' },
  { id: '5', name: 'Entertainment', icon: 'musical-notes', color: '#EC4899' },
  { id: '6', name: 'Health', icon: 'medical', color: '#10B981' },
  { id: '7', name: 'Education', icon: 'school', color: '#06B6D4' },
  { id: '8', name: 'Travel', icon: 'airplane', color: '#F97316' },
  { id: '9', name: 'Other', icon: 'ellipse', color: '#6B7280' },
];

const availableIcons = [
  'restaurant',
  'car',
  'bag',
  'receipt',
  'musical-notes',
  'medical',
  'school',
  'airplane',
  'home',
  'fitness',
  'gift',
  'card',
  'cash',
  'phone-portrait',
  'wifi',
  'shirt',
  'cafe',
  'wine',
  'game-controller',
  'book',
  'ellipse',
];

const availableColors = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#6B7280', // Gray
  '#84CC16', // Lime
  '#14B8A6', // Teal
];

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<ExpenseCategory[]>(defaultCategories);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(availableIcons[0]);
  const [selectedColor, setSelectedColor] = useState(availableColors[0]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      return;
    }

    const newCategory: ExpenseCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      icon: selectedIcon,
      color: selectedColor,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setShowAddModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            // @ts-ignore
            navigation.goBack();
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#10B981" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Grid */}
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryCard}>
              <TouchableOpacity
                style={[
                  styles.categoryIconContainer,
                  { backgroundColor: `${category.color}15` },
                ]}
              >
                <Ionicons
                  name={category.icon as any}
                  size={32}
                  color={category.color}
                />
              </TouchableOpacity>
              <Text style={styles.categoryName}>{category.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCategory(category.id)}
              >
                <Ionicons name="close-circle" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Add Category Button */}
        <TouchableOpacity
          style={styles.addCategoryCard}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add-circle-outline" size={40} color="#10B981" />
          <Text style={styles.addCategoryText}>Add New Category</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Category Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>

            {/* Category Name Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Category Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter category name"
                placeholderTextColor="#999999"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
              />
            </View>

            {/* Icon Selection */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Icon</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.iconScroll}
              >
                {availableIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.iconOptionSelected,
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons
                      name={icon as any}
                      size={24}
                      color={selectedIcon === icon ? '#10B981' : '#666666'}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Color Selection */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Color</Text>
              <View style={styles.colorGrid}>
                {availableColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.inputLabel}>Preview</Text>
              <View style={styles.previewCard}>
                <View
                  style={[
                    styles.previewIconContainer,
                    { backgroundColor: `${selectedColor}15` },
                  ]}
                >
                  <Ionicons
                    name={selectedIcon as any}
                    size={32}
                    color={selectedColor}
                  />
                </View>
                <Text style={styles.previewName}>
                  {newCategoryName || 'Category Name'}
                </Text>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                !newCategoryName.trim() && styles.saveButtonDisabled,
              ]}
              onPress={handleAddCategory}
              disabled={!newCategoryName.trim()}
            >
              <Text style={styles.saveButtonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  addCategoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addCategoryText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconScroll: {
    paddingVertical: 8,
    gap: 12,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#1A1A1A',
  },
  previewSection: {
    marginBottom: 24,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  previewIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



