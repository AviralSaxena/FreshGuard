import React, { useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../hooks/useAuth';

import SocialIcon from '../../component/SocialIcon'
import CustomButton from '../../component/CustomButton'

const SignUp = () => {
  const { signUp, loading } = useAuth();
  const [fName, setfName] = useState(''); 
  const [fNameFocused, setFNameFocused] = useState(false); 
  const [lName, setlName] = useState(''); 
  const [lNameFocused, setlNameFocused] = useState(false); 
  const [email, setEmail] = useState(''); 
  const [emailFocused, setEmailFocused] = useState(false); 
  const [password, setPassword] = useState(''); 
  const [passFocused, setPassFocused] = useState(false); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPassFocused, setConfirmPassFocused] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fName.trim()) {
      newErrors.fName = 'First name is required';
    } else if (fName.length < 2) {
      newErrors.fName = 'First name must be at least 2 characters';
    }

    if (!lName.trim()) {
      newErrors.lName = 'Last name is required';
    } else if (lName.length < 2) {
      newErrors.lName = 'Last name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      const result = await signUp(email, password, `${fName} ${lName}`);
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to create account');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Register</Text>
      <Text style={styles.subTitle}>Create an account</Text>
      <View style={styles.frames}>
        <View style={{ paddingTop: 13 }}> 
          <View style={styles.fnamecontainer}>
            <Text style={styles.labelText}>
              First Name
            </Text>
          </View>
          <TextInput
            placeholder='Linh'
            placeholderTextColor='#9B9A9A'
            onChangeText={setfName}
            value={fName}
            style={[
              styles.textInput, 
              {borderColor: fNameFocused ? '#97DB48' : errors.fName ? '#FF3B30' : '#E9E9E9'}
            ]}
            onFocus={() => setFNameFocused(true)}
            onBlur={() => setFNameFocused(false)}
            autoCapitalize='words'
            maxLength={40}
            selectionColor='#97DB48'
            secureTextEntry={false}
          />
          {errors.fName && <Text style={styles.errorText}>{errors.fName}</Text>}
        </View>
        <View style={{ paddingTop: 22 }}> 
          <View style={styles.labelcontainer}>
            <Text style={styles.labelText}>
              Last Name
            </Text>
          </View>
          <TextInput
            placeholder='Nguyen'
            placeholderTextColor='#9B9A9A'
            onChangeText={setlName}
            value={lName}
            style={[
              styles.textInput, 
              {borderColor: lNameFocused ? '#97DB48' : errors.lName ? '#FF3B30' : '#E9E9E9'}
            ]}
            onFocus={() => setlNameFocused(true)}
            onBlur={() => setlNameFocused(false)}
            autoCapitalize='words'
            maxLength={40}
            selectionColor='#97DB48'
            secureTextEntry={false}
          />
          {errors.lName && <Text style={styles.errorText}>{errors.lName}</Text>}
        </View>
        <View style={{ paddingTop: 22 }}> 
          <View style={styles.emaillabelcontainer}>
            <Text style={styles.labelText}>
              Email
            </Text>
          </View>
          <TextInput
            placeholder='linhkim1503@gmail.com'
            placeholderTextColor='#9B9A9A'
            onChangeText={setEmail}
            value={email}
            style={[
              styles.textInput, 
              {borderColor: emailFocused ? '#97DB48' : errors.email ? '#FF3B30' : '#E9E9E9'}
            ]}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            autoCapitalize='none'
            maxLength={40}
            selectionColor='#97DB48'
            secureTextEntry={false}
            inputMode='email'
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={{ paddingTop: 22 }}> 
          <View style={styles.passwordlabelcontainer}>
            <Text style={styles.labelText}>
              Password
            </Text>
          </View>
          <TextInput
            placeholderTextColor='#9B9A9A'
            onChangeText={setPassword}
            value={password}
            style={[
              styles.textInput, 
              {borderColor: passFocused ? '#97DB48' : errors.password ? '#FF3B30' : '#E9E9E9'}
            ]}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
            autoCapitalize='none'
            selectionColor='#97DB48'
            secureTextEntry={true}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        <View style={{ paddingTop: 22 }}> 
          <View style={styles.relabelcontainer}>
            <Text style={styles.labelText}>
              Confirmation
            </Text>
          </View>
          <TextInput
            placeholderTextColor='#9B9A9A'
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            style={[
              styles.textInput, 
              {borderColor: confirmPassFocused ? '#97DB48' : errors.confirmPassword ? '#FF3B30' : '#E9E9E9'}
            ]}
            onFocus={() => setConfirmPassFocused(true)}
            onBlur={() => setConfirmPassFocused(false)}
            autoCapitalize='none'
            selectionColor='#97DB48'
            secureTextEntry={true}
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>
        <View style={{ marginTop: 23}}>
          <CustomButton 
            title={loading ? "Creating Account..." : "Create an account"} 
            onPress={handleSignUp}
            disabled={loading}
          />
        </View>
        <View style={styles.separator}>
          <View style={styles.line}></View>
          <Text style={styles.signInText}>Sign In With</Text>
          <View style={styles.line}></View>
        </View>
        <View style={styles.socialIcon}>
          <SocialIcon/>
        </View>
      </View>
    </SafeAreaView>
  )
}; 

export default SignUp; 

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,     
    backgroundColor: '#D4F0AB',  
    paddingTop: 40,             
  },
  title: {
    paddingTop: 40,
    fontFamily: 'Poppins-Medium', 
    fontSize: 40, 
    alignItems: 'left', 
    marginHorizontal: 30,
  }, 
  subTitle: {
    fontFamily: 'Poppins-Light', 
    fontSize: 16, 
    alignItems: 'left', 
    marginHorizontal: 30,
    marginTop: 13, 
  },
  frames: {
    marginTop: 14, 
    height: '100%', 
    width: '100%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 50, 
    padding: 23, 
    paddingHorizontal: 30
  }, 
  fnamecontainer: {
    position: 'absolute',
    left: 14, 
    backgroundColor: '#FFFFFF', 
    width: 95, 
    height: 20,
    zIndex: 1,
    marginVertical: 2, 
    alignItems: 'center', 
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
    // width: 333, 
    height: 50, 
    borderRadius: 10, 
    paddingLeft: 22, 
    zIndex: 0, 
  }, 
  labelcontainer: {
    position: 'absolute',
    left: 14, 
    backgroundColor: '#FFFFFF', 
    width: 90, 
    height: 20,
    zIndex: 1,
    marginVertical: 11, 
    alignItems: 'center', 
    zIndex: 1,
  }, 
  emaillabelcontainer: {
    position: 'absolute',
    left: 14, 
    backgroundColor: '#FFFFFF', 
    width: 52, 
    height: 20,
    zIndex: 1,
    marginVertical: 11, 
    alignItems: 'center', 
  }, 
  passwordlabelcontainer: {
    position: 'absolute',
    left: 14, 
    backgroundColor: '#FFFFFF', 
    width: 83, 
    height: 20,
    zIndex: 1,
    marginVertical: 11, 
    alignItems: 'center', 
    zIndex: 1,
  }, 
  relabelcontainer: {
    position: 'absolute',
    left: 15, 
    backgroundColor: '#FFFFFF', 
    width: 110, 
    height: 20,
    zIndex: 1,
    marginVertical: 11, 
    alignItems: 'center', 
    zIndex: 1,
  }, 
  separator: {
    flexDirection: 'row', 
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  line: {
    flex: 1, 
    backgroundColor: '#737B98',
    height: 0.1,
    opacity: 0.3, 
  },
  signInText: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    color: '#737B98',
    marginHorizontal: 6, 
  }, 
  socialIcon: {
    marginTop: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'Poppins-Regular',
    marginLeft: 15,
  },
})