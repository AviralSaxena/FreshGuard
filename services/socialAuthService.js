import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SocialAuthService {
  static async storeUserData(user) {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  }

  static async signInWithApple() {
    try {
      if (!(await AppleAuthentication.isAvailableAsync())) {
        return { success: false, error: 'Apple sign-in is not available' };
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const mockUser = {
          id: 'apple_' + credential.user,
          email: credential.email || 'apple_user@example.com',
          name: credential.fullName?.givenName || 'Apple User',
          provider: 'apple'
        };

        await this.storeUserData(mockUser);
        return { success: true, user: mockUser };
      }

      return { success: false, error: 'Apple sign-in failed' };
    } catch (error) {
      console.error('Apple sign-in error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SocialAuthService; 