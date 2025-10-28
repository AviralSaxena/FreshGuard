import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CustomButton from '../../component/CustomButton';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const router = useRouter();

  // const handleContinue = () => {
  //   if (!email) {
  //     Alert.alert('Error', 'Please enter your email.');
  //     return;
  //   }
  //   if (!validateEmail(email)) {
  //     Alert.alert('Error', 'Please enter a valid email address.');
  //     return;
  //   }
  //   router.push('/email-sent');
  // };

  // const validateEmail = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      > */}
        {/* <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        > */}
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subTitle}>Enter your email to reset password</Text>

          <View style={styles.frames}>
            <View style={{ paddingTop: 98 }}>
              <View style={styles.emaillabelcontainer}>
                <Text style={styles.labelText}>Email</Text>
              </View>
              <TextInput
                placeholder="linhkim1503@gmail.com"
                placeholderTextColor="#9B9A9A"
                onChangeText={setEmail}
                value={email}
                style={[
                  styles.textInput,
                  { borderColor: emailFocused ? '#97DB48' : '#E9E9E9' }
                ]}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
                maxLength={40}
                inputMode='email'
                selectionColor="#97DB48"
              />
            </View>
            {/* <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity> */}
            <View style={{ paddingTop: 48}}>
              <CustomButton title="Continue" route='/email'/>
            </View>

            <TouchableOpacity 
              onPress={() => router.back('/sign-in')}
              style={styles.backButton}
            >
              <AntDesign name="arrowleft" size={20} color="#737B98" />
              <Text style={styles.backText}>Back to log in</Text>
            </TouchableOpacity>
          </View>
        {/* </ScrollView>
      </KeyboardAvoidingView> */}
    </SafeAreaView>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D4F0AB',
    paddingTop: 40, 
  },
  // scrollContainer: {
  //   flexGrow: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingHorizontal: 0,
  //   paddingVertical: 330,
  //   marginTop: -250,
  // },
  title: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 32, 
    alignItems: 'left', 
    marginHorizontal: 30, 
    paddingTop: 40, 
  }, 
  subTitle: {
    fontFamily: 'Poppins-Light', 
    fontSize: 16, 
    alignItems: 'left', 
    marginHorizontal: 30,
    marginTop: 10, 
  },
  frames: {
    marginTop: 25, 
    height: '100%', 
    width: '100%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 50, 
    paddingHorizontal: 30
  }, 
  // labelText: {
  //   fontFamily: 'Poppins-Regular',
  //   fontSize: 14,
  //   color: '#737B98',
  //   marginBottom: 0,
  // },
  emaillabelcontainer: {
    position: 'absolute',
    left: 14, 
    backgroundColor: '#FFFFFF', 
    width: 60, 
    height: 20,
    zIndex: 1,
    marginVertical: 86, 
    alignItems: 'center', 
  }, 
  labelText: {
    position: 'absolute', 
    color: '#737B98', 
    fontFamily: 'Poppins-Regular',
    fontSize: 15, 
    alignItems: 'flex-start',  
  },
  // textInput: {
  //   height: 50,
  //   borderWidth: 1,
  //   borderRadius: 10,
  //   paddingHorizontal: 15,
  //   fontSize: 16,
  //   fontFamily: 'Poppins-Light',
  //   backgroundColor: '#F9F9F9',
  // },
  textInput: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    borderWidth: 1, 
    height: 60, 
    borderRadius: 10, 
    paddingLeft: 22, 
    zIndex: 0, 
  }, 
  backText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#737B98',
    marginHorizontal: 5, 
  },
  backButton: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingTop: 54, 
  }
});