import React, { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Platform, KeyboardAvoidingView,} from 'react-native';
import { useRouter } from 'expo-router';
import images from '../../constants/images';
import { changePassword } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = () => {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState(''); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('user').then(data => {
      const user = JSON.parse(data); 
      setUserEmail(user?.email || '')
    }); 
  }, []); 

  const handleChangePassword = async () => {
    if (!currentPassword || !password || !confirmation) {
      alert('Please fill in all fields.');
      return;
    }
    if (password !== confirmation) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const userData =  await AsyncStorage.getItem('user'); 
      const user = userData ? JSON.parse(userData) : null;
      const userId = user?.userId; 

      if (!userId) {
        alert('User not found. Please try again!!'); 
        return; 
      }

      await changePassword(userId, currentPassword, password); 

      alert('Password changed successfully!'); 
      router.back(); 
    } catch (error) {
      const msg = error.response?.data?.message || 'Password changed failed'; 
      alert(msg); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <Image source={images.translogo} style={styles.logo} />

          {/* Title */}
          <Text style={styles.title}>Change Password</Text>
          <Text style={styles.subtitle}>Create a strong password for</Text>
          <Text style={styles.email}>{userEmail}</Text>

          {/* Input Fields */}
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmation"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmation}
            onChangeText={setConfirmation}
          />

          {/* Change Password Button */}
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  backText: {
    fontSize: 20,
    color: '#444',
  },
  logo: {
    width: 300,
    height: 250,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    fontFamily: 'Poppins-SemiBold', 
    marginTop: -50,
    color: '#000',
    marginBottom: 10
  },
  subtitle: {
    fontFamily: 'Poppins-Regular', 
    fontSize: 18,
    color: '#666',
  },
  email: {
    fontFamily: 'Poppins-Regular', 
    fontSize: 16,
    color: '#666',
    marginTop: 5, 
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#97DB48',
    width: '100%',
    height: 55,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    // Android shadow
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
