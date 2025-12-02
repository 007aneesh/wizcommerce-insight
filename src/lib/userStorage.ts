/**
 * Utility functions for managing user details in localStorage
 */

const USER_DETAILS_KEY = 'userDetails';

export const userStorage = {
  setUserDetails: (userDetails: unknown) => {
    try {
      localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(userDetails));
    } catch (error) {
      console.error('Failed to save user details to localStorage:', error);
    }
  },

  getUserDetails: <T = unknown>(): T | null => {
    try {
      const stored = localStorage.getItem(USER_DETAILS_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to read user details from localStorage:', error);
      return null;
    }
  },

  removeUserDetails: () => {
    try {
      localStorage.removeItem(USER_DETAILS_KEY);
    } catch (error) {
      console.error('Failed to remove user details from localStorage:', error);
    }
  },
};

