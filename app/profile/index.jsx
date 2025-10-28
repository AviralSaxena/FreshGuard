import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import ProfileIcon from '../../component/ProfileIcon';
import images from '../../constants/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchUserById } from '../../api';
import { icons } from '../../constants';
import { useLocalSearchParams } from "expo-router";

const { width, height } = Dimensions.get('window');

const Profile = () => {
  const router = useRouter();
  const [isDarkMode, setDarkMode] = useState(false);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setError] = useState(null); 

  const { reload } = useLocalSearchParams();
  
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const stored = await AsyncStorage.getItem("user");
        const parsed = stored ? JSON.parse(stored) : null;
        const userId = parsed?.data?.userId || parsed?.userId || parsed?.id;
  
        if (!userId) throw new Error("User ID not found in storage");
  
        const user = await fetchUserById(userId);
        setUserData({
          username: user.username,
          dateCreated: formatYear(user.createdAt), 
          imageURL: user.imageURL, 
        }); 
      } catch (err) {
        console.error("Error loading user by ID:", err.message);
      } finally {
        setLoading(false); // ✅ Prevent infinite spinner
      }
    };
  
    loadUser();
  }, [reload]);


  const formatYear = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const handleLogout = async () => {
    try {
      // Clear user token or any saved data
      await AsyncStorage.removeItem('userToken'); // Adjust if storing a different key
      console.log('User logged out successfully');
  
      // Reset navigation to prevent going back after logout
      router.replace('/(auth)/sign-in');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleGoBack = async () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, {justifyContent: 'space-between'}]}>
        {/* Gray Box - Left Side */}
        <TouchableOpacity onPress={handleGoBack}>
          <View style={styles.backContainer}>
            <Image source={icons.right} style={styles.backIcons} />
          </View>
        </TouchableOpacity>

        <View style={[styles.fresherContainer, {justifyContent: 'flex-end'}]}>
          <Image source={{uri: "https://fgcredentialsabc.blob.core.windows.net/defaultprofile/flower.gif"}} style={styles.flower} />
          <Text style={styles.textHeader}>Fresher</Text>
        </View>

      </View>

      <ScrollView style={styles.container}>
        {/* PROFILE SECTION */}
        <View style={styles.profileHeader}>
          <View>
            <ProfileIcon size={70} uri={userData?.imageURL}/>
            {/* <View style={styles.cameraContainer}>
              <Image
                source={icons.camera}
                style={{ width: 22, height: 18, resizeMode: 'contain', }}
              />              
            </View> */}
          </View>
          <View style={{ flexDirection: 'column', marginBottom: 1}}>
            <Text style={styles.nameProfile}>{userData?.username || 'Linh Nguyen'}</Text>
            <Text style={styles.member}>Member since {userData?.dateCreated || '2024'}</Text>
          </View>
        </View>

        {/* ACCOUNT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('profile/editprofile')}>
            <Text style={styles.buttonText}>Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/profile/changepw')}  
          >
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Notification</Text>
          </TouchableOpacity>
        </View>

        {/* SUBSCRIPTION SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Fresher Plus +</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Manage your subscription</Text>
          </TouchableOpacity>
        </View>

        {/* PREFERENCES SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.toggleContainer}>
            <Text style={styles.buttonText}>Dark mode</Text>
            <Switch value={isDarkMode} onValueChange={(value) => setDarkMode(value)} />
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Notification</Text>
          </TouchableOpacity>
        </View>

        {/* HELP & SUPPORT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>FAQ / Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Report an Issue</Text>
          </TouchableOpacity>
        </View>

        {/* LEGAL SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Terms & Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Report an Issue</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={[
            {
              backgroundColor: '#FFFFFF',
              padding: 20,
              borderRadius: 12,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#EAEAEA',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            },
          ]}
          onPress={handleLogout}
        >
          <Image
            source={icons.logout}
            style={{
              width: 30,
              height: 30,
              tintColor: '#D33528',
              transform: [{ rotate: '180deg' }],
              marginRight: 20,
            }}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.13,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    zIndex: 1,
    padding: '5%',
  },
  backContainer: {
    width: 45, 
    height: 45, 
    backgroundColor: '#F0F0F0',
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: "center", 
  }, 
  backIcons: {
    tintColor: '#999999', 
    width: 30, 
    height: 30,
    resizeMode: 'contain',
    transform: [{ rotate: "180deg"}]
  }, 
  fresherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.35,
    height: height * 0.05,
    borderColor: '#BEEC83',
    borderWidth: 0.5,
    borderRadius: 50,
    alignContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  flower: {
    width: '50%',
    height: '70%',
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: -10, 
    marginTop: -5, 
  },
  textHeader: {
    fontSize: 20,
    fontFamily: 'Poppins-Medium',
    color: '#636363',
    marginTop: 1,
    padding: 2,
    marginRight: 7,  
    alignItems: 'center',
    justifyContent: 'space-around',
    // backgroundColor: 'green'
  },
  profileHeader: {
    flexDirection: 'row',
    paddingTop: '17%',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 30,
  },
  container: {
    flex: 1,
    padding: 20, 
    backgroundColor: '#F3F3F3',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 20, 
    color: '#333',
    marginBottom: 12,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    color: '#333',
    fontSize: 18,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 12,
  },
  logoutText: {
    color: '#D33528',
    fontSize: 22,
    fontFamily: 'Poppins-Regular',
  },
  nameProfile: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
  },
  member: {
    fontFamily: 'Poppins-Light',
    fontSize: 16,
  },
  cameraContainer: {
    width: 25, 
    height: 25, 
    borderRadius: 50, 
    backgroundColor: 'white', 
    justifyContent: 'center',
    alignItems: 'center', 
    position: 'absolute', 
    alignSelf: 'flex-end',
    bottom: 0,
  },
});
