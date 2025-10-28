import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Platform, Alert, ActivityIndicator } from 'react-native';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import SocialAuthService from '../services/socialAuthService';

const SocialIcon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to sign in with Google');
      } else {
        // Store user data
        await SocialAuthService.storeUserData(result.user);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await SocialAuthService.signInWithApple();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to sign in with Apple');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || googleLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconContainer} 
        onPress={handleGoogleSignIn}
        disabled={isLoading || googleLoading}
      >
        <Image
          source={require('../assets/images/google.png')}
          style={styles.icon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={handleAppleSignIn}
          disabled={isLoading}
        >
          <Image
            source={require('../assets/images/apple.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: '70%',
    height: '100%',
  },
});

export default SocialIcon;