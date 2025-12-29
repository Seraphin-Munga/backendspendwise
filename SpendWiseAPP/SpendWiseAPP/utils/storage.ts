/**
 * Storage utility for React Native and Web
 * Handles token storage using AsyncStorage (React Native) or localStorage (Web)
 */

// Dynamic import for AsyncStorage to avoid issues in web environment
let AsyncStorage: any = null;

// Initialize AsyncStorage only in React Native environment
const initAsyncStorage = () => {
  if (AsyncStorage !== null) return AsyncStorage;
  
  // Check if we're in a web environment
  if (typeof window !== 'undefined' && window.localStorage) {
    return null; // Web environment, use localStorage
  }
  
  // React Native environment - try to load AsyncStorage
  try {
    const asyncStorageModule = require('@react-native-async-storage/async-storage');
    AsyncStorage = asyncStorageModule.default || asyncStorageModule;
    return AsyncStorage;
  } catch (error) {
    console.warn('AsyncStorage not available:', error);
    return null;
  }
};

export const storage = {
  /**
   * Get item from storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      // Use localStorage for web
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      
      // Use AsyncStorage for React Native
      const storage = initAsyncStorage();
      if (storage) {
        return await storage.getItem(key);
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  },

  /**
   * Set item in storage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      // Use localStorage for web
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return;
      }
      
      // Use AsyncStorage for React Native
      const storage = initAsyncStorage();
      if (storage) {
        await storage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
    }
  },

  /**
   * Remove item from storage
   */
  async removeItem(key: string): Promise<void> {
    try {
      // Use localStorage for web
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
        return;
      }
      
      // Use AsyncStorage for React Native
      const storage = initAsyncStorage();
      if (storage) {
        await storage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
    }
  },

  /**
   * Remove multiple items from storage
   */
  async multiRemove(keys: string[]): Promise<void> {
    try {
      // Use localStorage for web
      if (typeof window !== 'undefined' && window.localStorage) {
        keys.forEach(key => localStorage.removeItem(key));
        return;
      }
      
      // Use AsyncStorage for React Native
      const storage = initAsyncStorage();
      if (storage) {
        await storage.multiRemove(keys);
      }
    } catch (error) {
      console.error('Error removing multiple items:', error);
    }
  },
};
