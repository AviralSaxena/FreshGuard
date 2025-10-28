import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { loginRequest, createUser } from '../api';

// Mock user data - replace with actual API calls in production
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  }
];

class AuthService {
  static async signIn(email, password) {
    try {
      console.log("inside Auth Service -- attempting to call loginRequest api")
      const user = await loginRequest(email, password);
      console.log(user);
      // Add API up here -- call the sign in request API to backend using user data

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Store user data
      const userData = {
        userId: user.userId, 
        email: user.email,
        name: user.name
      };

      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Route to home screen after successful login
      router.replace('/(tabs)/home');
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Sign in error:', error);
      const status = error?.response?.status;

      if (status === 401) {
        return { success: false, error: 'Incorrect email or password' };
      }
      
      return { success: false, error: error.message || 'Sign in failed' };
    }
  }

  static async signUp(email, password, name) {
    try {
      const [firstName, lastName] = name.split(' ');
      const userData = {
        firstName,
        lastName,
        email,
        password,
      };

      const newUser = await createUser(userData); 

      const storedUser = {
        // id: newUser.id,
        userId: newUser.userId,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`
      };

      await AsyncStorage.setItem('user', JSON.stringify(storedUser));
      router.replace('/(tabs)/home');
      
      return { success: true, user: storedUser };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error?.response?.data?.message || error.message || 'Sign up failed',
      };
    }
  }

  static async signOut() {
    try {
      await AsyncStorage.removeItem('user');
      router.replace('/sign-in');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  static async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }
}

export default AuthService; 