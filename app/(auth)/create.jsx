import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import icons from '../../constants/icons';
import images from '../../constants/images';

const CreateNewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const router = useRouter();
    const [passFocused, setPassFocused] = useState(false); 
    const [repassFocused, setRePassFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmationVisibility = () => {
    setConfirmationVisible(!isConfirmationVisible);
  };

  const handleResetPassword = () => {
    if (!password || !confirmation) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (password !== confirmation) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    Alert.alert('Success', 'Your password has been reset!');
    router.push('/sign-in');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>


          {/* Title and Email */}
          <View style={styles.titleContainer}>
            {/* Logo */}
            <Image
              source={images.translogo} 
              style={styles.logo}
            />
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>Create a strong password for</Text>
            <Text style={styles.email}>l********3@email.com</Text>
          </View>


          {/* Password Input */}
          <View style={{ paddingTop: 45 }}> 
            <View style={styles.passwordlabelcontainer}>
              <Text style={styles.labelText}>
                Password
              </Text>
            </View>
            <TextInput
              placeholderTextColor='#9B9A9A'
              onChange={setPassword}
              value={password}
              style={[
                styles.textInput, 
                {borderColor: passFocused ? '#97DB48' : '#E9E9E9'} // Change color border when selected
              ]}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              autoCapitalize='none'
              selectionColor='#97DB48'
              secureTextEntry={true}
            />
          </View>


          <View style={{ paddingTop: 45 }}> 
            <View style={styles.relabelcontainer}>
              <Text style={styles.labelText}>
                Confirmation
              </Text>
            </View>
            <TextInput
              placeholderTextColor='#9B9A9A'
              onChange={setConfirmation}
              value={confirmation}
              style={[
                styles.textInput, 
                {borderColor: repassFocused ? '#97DB48' : '#E9E9E9'} // Change color border when selected
              ]}
              onFocus={() => setRePassFocused(true)}
              onBlur={() => setRePassFocused(false)}
              autoCapitalize='none'
              selectionColor='#97DB48'
              secureTextEntry={true}
            />
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateNewPassword;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  logo: {
      width: 300,
      height: 250,
      alignItems: 'center',
      marginTop: -50,
      marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center', 
  }, 
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 30,
    marginBottom: 5,
    marginTop: -50,
    color: '#000',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#666',
  },
  email: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
  labelText: {
    position: 'absolute', 
    color: '#737B98', 
    fontFamily: 'Poppins-Regular',
    fontSize: 15, 
    alignItems: 'flex-start',  
  },
  textInput: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    borderWidth: 1,
    height: 50, 
    borderRadius: 10, 
    paddingHorizontal: 20, 
  }, 
  passwordlabelcontainer: {
    position: 'absolute',
    left: 15, 
    backgroundColor: '#FFFFFF', 
    width: 83, 
    height: 20,
    zIndex: 1,
    marginVertical: 32, 
    alignItems: 'center', 
  }, 
  relabelcontainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF', 
    width: 110, 
    left: 15,
    height: 20,
    zIndex: 1,
    marginVertical: 30, 
    alignItems: 'center', 
  }, 
  eyeIcon: {
    width: 20,
    height: 20,
    paddingRight: 25, 
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#97DB48', 
    justifyContent: 'center',
    width: '100%', 
    height: 60, 
    alignItems: 'center', 
    borderRadius: 16, 
    marginTop: 60, 
    // Drop shadow for iOS
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4}, 
    shadowOpacity: 0.25, 
    shadowRadius: 10, 
    // Drop shadow for Android
    elevation: 5, 
  },
  buttonText: {
    color: '#FFFFFF', 
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 18, 
    alignItems: 'center', 
  },
});