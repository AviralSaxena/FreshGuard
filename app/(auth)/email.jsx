import React from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform, 
} from 'react-native';
import CustomButton from '../../component/CustomButton';
import { AntDesign } from '@expo/vector-icons';
import images from '../../constants/images';


const EmailSent = () => {
  const router = useRouter();

  const handleResend = () => {
    Alert.alert('Resent', 'A new password reset link has been sent!');
  };

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
      {/* Logo */}
      <View style={styles.container}>
        <View style={styles.image}> 
          <Image source={images.translogo} style={styles.logo}/>
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {/* Title */}
          <Text style={styles.title}>Check your email</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>We sent a password reset link to</Text>
          <Text style={styles.email}>l********3@email.com</Text>
        </View>

        {/* Continue Button */}
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/create-new-password')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity> */}
        <View style={styles.button}>
          <CustomButton title="Continue" route='./create'/>
        </View>

        {/* Resend Link */}
        <View style={styles.linksContainer}>
          <Text style={styles.text}>Didn't receive the email? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Resend</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Login */}
        {/* <TouchableOpacity onPress={() => router.back('/sign-in')}>
          <Text style={styles.backText}>← Back to log in</Text>
        </TouchableOpacity> */}
        <TouchableOpacity 
          onPress={() => router.back('/sign-in')}
          style={styles.backButton}
        >
          <AntDesign name="arrowleft" size={20} color="#737B98" />
          <Text style={styles.backText}>Back to log in</Text>
        </TouchableOpacity>
          {/* </ScrollView> */}
        {/* </KeyboardAvoidingView> */}
      </View>
    </SafeAreaView>
  );
};

export default EmailSent;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // scrollContainer: {
  //   flexGrow: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  container: {
    flex: 1,
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 30,
  },
  image: {
  }, 
  logo: {
    width: 300,
    height: 300,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 30,
    color: '#000',
  },
  subtitle: {
    paddingTop: 11, 
    fontFamily: 'Poppins-Light',
    fontSize: 18,
    color: '#000000',
  },
  email: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    color: '#000000',
    paddingTop: 5, 
  },
  button: {
    width: '95%', 
    marginTop: 40, 
  }, 
  // button: {
  //   width: '100%',
  //   height: 50,
  //   backgroundColor: '#97DB48',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 8,
  //   marginBottom: 10,
  // },
  // buttonText: {
  //   color: '#fff',
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   fontFamily: 'Poppins-Medium',
  // },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 21,
  },
  text: {
    fontSize: 14,
    color: '#737B98',
    fontFamily: 'Poppins-Medium',
  },
  resendText: {
    fontSize: 14,
    color: '#97DB48',
    fontFamily: 'Poppins-Medium',
  },
  // backText: {
  //   color: '#3B82F6',
  //   fontSize: 14,
  //   fontFamily: 'Poppins-Regular',
  //   marginTop: 10,
  // },
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
    paddingTop: 40, 
  }
});