import React, { useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native'
import { router } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../../hooks/useAuth';

import SocialIcon from '../../component/SocialIcon'
import CustomButton from '../../component/CustomButton'

const SignIn = () => {
  const { signIn, loading } = useAuth();
  const [isSelected, setSelection] = useState(false); 
  const [email, setEmail] = useState(''); 
  const [emailFocused, setEmailFocused] = useState(false); 
  const [password, setPassword] = useState(''); 
  const [passFocused, setPassFocused] = useState(false); 

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    const result = await signIn(email, password);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to sign in');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Sign In to Your</Text>
      <Text style={styles.accountTitle}>Account</Text>
      <Text style={styles.subTitle}>Sign in to your Account</Text>
      <View style={styles.frames}>
        {/* Email Input */}
        <View style={{ paddingTop: 45 }}> 
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
              {borderColor: emailFocused ? '#97DB48' : '#E9E9E9'}
            ]}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            autoCapitalize='none'
            maxLength={40}
            selectionColor='#97DB48'
            secureTextEntry={false}
            inputMode='email'
          />
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
            onChangeText={setPassword}
            value={password}
            style={[
              styles.textInput, 
              {borderColor: passFocused ? '#97DB48' : '#E9E9E9'}
            ]}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
            autoCapitalize='none'
            selectionColor='#97DB48'
            secureTextEntry={true}
          />
        </View>
        <View style={styles.boxContainer}>
          <View style={styles.checkBoxContainer}>
            <TouchableOpacity style={{ marginTop: -2,  marginRight: 4, alignItems: 'center'}} onPress={() => setSelection(!isSelected)}>
              {isSelected ? (
                <MaterialIcons name='check-box' size={20} color='#97DB48'/>
              ): (
                <MaterialIcons name="check-box-outline-blank" size={20} color='#97DB48'/>
              )}
            </TouchableOpacity>
            <Text style={styles.label}>Keep Me Login</Text>
          </View>
          <View style={styles.forgotContainer}>
            <TouchableOpacity onPress={() => router.push('/forgot')}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 57}}>
          <CustomButton 
            title={loading ? "Signing In..." : "Sign In"} 
            onPress={handleSignIn}
            disabled={loading}
            route='/home'
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.replace('/sign-up')}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator}>
          <View style={styles.line}></View>
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line}></View>
        </View>
        <View style={styles.socialIcon}>
          <SocialIcon/>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SignIn; 

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,     
    backgroundColor: '#D4F0AB',                
  },
  title: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 30, 
    alignItems: 'left', 
    marginHorizontal: 30,
    marginTop: Platform.OS === 'ios' ? 20 : 30, 
  }, 
  accountTitle: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 30, 
    marginHorizontal: 30,
    alignItems: 'left', 
  }, 
  subTitle: {
    fontFamily: 'Poppins-Light', 
    fontSize: 16, 
    alignItems: 'left', 
    marginHorizontal: 30,
    marginTop: 10 
  },
  frames: {
    marginTop: 15, 
    height: '100%', 
    width: '100%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 50, 
    paddingHorizontal: 30
  },
  emaillabelcontainer: {
    position: 'absolute',
    left: 14, 
    backgroundColor: '#FFFFFF', 
    width: 60, 
    height: 20,
    zIndex: 1,
    marginVertical: 33, 
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
    height: 50, 
    borderRadius: 10, 
    paddingLeft: 22, 
    zIndex: 0, 
  }, 
  passwordlabelcontainer: {
    position: 'absolute',
    left: 14, 
    backgroundColor: '#FFFFFF', 
    width: 90, 
    height: 20,
    zIndex: 1,
    marginVertical: 33, 
    alignItems: 'center', 
    zIndex: 1,
  }, 
  boxContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 23,
    justifyContent: 'space-between', 
  }, 
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 12, 
    color: '#000000',
  }, 
  forgotContainer: {
    flex: 1, 
    alignItems: 'flex-end'
  }, 
  forgotText: {
    fontFamily: 'Poppins-Light', 
    fontSize: 10, 
    color: '#737B98'
  }, 
  textContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 54, 
    flexDirection: 'row',
    alignContent: 'center', 
  }, 
  text: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 15, 
    marginHorizontal: 4, 
  }, 
  signUpText: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 15, 
    color: '#97DB48'
  }, 
  separator: {
    flexDirection: 'row', 
    marginTop: 49,
    justifyContent: 'center',
    alignItems: 'center'
  },
  line: {
    flex: 1, 
    backgroundColor: '#737B98',
    height: 0.1,
    opacity: 0.3, 
  },
  orText: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 13, 
    justifyContent: 'center', 
    alignItems: 'center', 
    color: '#737B98',
    marginHorizontal: 6, 
  }, 
  socialIcon: {
    marginTop: 20,
  },
})