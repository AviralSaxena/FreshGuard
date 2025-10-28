import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable, 
  Platform, 
  ScrollView, 
  Image,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { icons, profile } from "../../constants";
import { fetchUserById, updateUser } from "../../api";
import * as ImagePicker from 'expo-image-picker';

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const PersonalInformation = () => {
  const router = useRouter();
  const [username, setUsername] = useState(""); // Added username state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [showPicker, setShowPicker] = useState(false); 
  const [gender, setGender] = useState(null);
  const [userId, setUserId] = useState(""); // Store user ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date()); 
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); 

  // Focus states for border color change
  const [userNameFocused, setUserNameFocused] = useState(false);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [birthdayFocused, setBirthdayFocused] = useState(false);
  const [genderFocused, setGenderFocused] = useState(false);
  const [isDropdownFocused, setIsDropdownFocused] = useState(false);


  const toggleDatepicker = () => setShowPicker(!showPicker);

  const onChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate; 
      setDate(currentDate); 

      if (Platform.OS === "android") {
        toggleDatepicker(); 
        setBirthday(formatDate(currentDate)); 
      }
    } else {
      toggleDatepicker(); 
    }
  }; 

  const confirmIOSDate = () => {
    setBirthday(formatDate(date)); 
    toggleDatepicker(); 
  }; 

  const formatDate = (rawData) => {
    let date = new Date(rawData); 

    let year = date.getFullYear(); 
    let month = date.getMonth() + 1; 
    let day = date.getDate();

    month = month < 10 ? `0${month}` : month; 
    day = day < 10 ? `0${day}` : day; 

    return `${month}/${day}/${year}`; 
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        const parsed = stored ? JSON.parse(stored) : null;
        const userId = parsed?.userId;

        if (!userId) throw new Error("User ID not found in storage");

        const user = await fetchUserById(userId);
        setUserId(user.userId);
        setUsername(user.username || "");
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setBirthday(user.birthday || "");;
        setGender(user.gender || null);
        setImageUrl(user.imageUrl || null); 
        setProfileImage(user.imageUrl || null); 
        console.log("Loaded user:", user);
        // Do something with `user`
      } catch (err) {
        console.error("Error loading user by ID:", err.message);
      }
    };

    loadUser();
  }, []);
  // Save Changes (Update User)
  const handleSave = async () => {
    const updateData = {
      username, 
      firstName,
      lastName,
      email,
      birthday,
      gender,
    };

    let file = null; 
    
    if (profileImage && profileImage.startsWith("file://")){
      file = {
        uri: profileImage, 
        type: 'image/jpeg', 
      }
    }

    try {
      if (userId) {
        await updateUser(userId, updateData, file); // Call updateUser
        console.log("User information updated successfully!");
        router.replace({
          pathname: '/profile', 
          params: {reload: Date.now() }
        }); 
      } else {
        console.error("Error: User ID not found.");
      }
    } catch (error) {
      console.error("Error updating user:", error.message || error);
    }
  };

  const pickImage = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert("Permission Denied", "Please allow access to camera and photos.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Image Picker Error:", err);
    }
  };

  // if (loading) {
  //   return (
  //     <View style={[styles.container, { justifyContent: "center" }]}> 
  //       <ActivityIndicator size="large" color="#97DB48" />
  //     </View>
  //   );
  // }

  const handleGoBack = async () => {
    router.back(); 
  }

  return (
    <>
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Gray Box - Left Side */}
          <TouchableOpacity onPress={handleGoBack}>
            <View style={[styles.backContainer]}>
              <Image source={icons.right} style={styles.backIcons} />
            </View>
          </TouchableOpacity>

          {/* Title - Centered */}
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.title}>Personal Information</Text>
          </View>
        </View>
      </View>
      <ScrollView 
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.container, isDropdownFocused && { paddingBottom: 300 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Profile Icon Centered */}
        <TouchableOpacity style={styles.profileContainer} onPress={() => {
          console.log("Pick Image");
          pickImage(); 
        }}>
          <Image source={{ uri: profileImage || imageUrl }} style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 50}}/>
          <View style={styles.cameraContainer}>
            <Image
              source={icons.camera}
              style={{ width: 22, height: 18, resizeMode: 'contain' }}
            />
          </View>
        </TouchableOpacity>


        {/* Username */}
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}><Text style={styles.labelText}>Username</Text></View>
          <TextInput
            style={[styles.input, { borderColor: userNameFocused ? "#97DB48" : "#E0E0E0" }]}
            value={username}
            onChangeText={setUsername}
            onFocus={() => setUserNameFocused(true)}
            onBlur={() => setUserNameFocused(false)}
          />
        </View>

        {/* First Name Input */}
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>First Name</Text>
          </View>
          <TextInput
            style={[
              styles.input,
              { borderColor: firstNameFocused ? "#97DB48" : "#E0E0E0" },
            ]}
            // placeholder="First Name"
            placeholderTextColor="#A0A0A0"
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setFirstNameFocused(true)}
            onBlur={() => setFirstNameFocused(false)}
          />
        </View>

        {/* Last Name Input */}
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Last Name</Text>
          </View>
          <TextInput
            style={[
              styles.input,
              { borderColor: lastNameFocused ? "#97DB48" : "#E0E0E0" },
            ]}
            // placeholder="Last Name"
            placeholderTextColor="#A0A0A0"
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setLastNameFocused(true)}
            onBlur={() => setLastNameFocused(false)}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Email</Text>
          </View>
          <TextInput
            style={[
              styles.input,
              { borderColor: emailFocused ? "#97DB48" : "#E0E0E0" },
            ]}
            // placeholder="Email"
            placeholderTextColor="#A0A0A0"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        {/* Birthday Input */}
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={date}
            onChange={onChange}
            style={styles.datePicker}
            maximumDate={new Date()}
            minimumDate={new Date('1960-1-1')}
            textColor="#000000"
          />
        )}

        {showPicker && Platform.OS === "ios" && (
          <View
            style={{  flexDirection: 'row', 
                      justifyContent: 'space-around',
                      gap: 40,
                      paddingBottom: 20, 
            }}
          > 

            <TouchableOpacity style={[ 
              styles.button, 
              styles.pickerButton,
              { backgroundColor: "#11182711"}
            ]}
              onPress={toggleDatepicker}
            >
              <Text style={[styles.buttonText, {color: "rgba(230, 15, 15, 0.96)"}]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[
              styles.button, 
              styles.pickerButton, 
              { backgroundColor: "rgba(212, 240, 171, 0.53)" }
            ]}
              onPress={confirmIOSDate}
            >
              <Text style={[styles.buttonText, {color: "rgba(0, 0, 0, 0.82)"}]}>
                Save
              </Text>
            </TouchableOpacity>
          </View> 
        )}

        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Date Of Birth</Text>
          </View>
          {!showPicker && (
            <Pressable 
              style={{ width: '100%',  }}
              onPress={toggleDatepicker}
            >
              <TextInput
                value={birthday}
                style={[styles.input, 
                  { borderColor: birthdayFocused ? "#97DB48" : "#E0E0E0" },
                ]}
                onChangeText={setBirthday}
                onPress={toggleDatepicker}
                // placeholder="Birthday"
                placeholderTextColor="#A0A0A0"
                onPressIn={toggleDatepicker}
                editable={false}
                onFocus={() => setBirthdayFocused(true)}
                onBlur={() => setBirthdayFocused(false)}
              />
            </Pressable>
          )}
        </View>

        {/* Gender Dropdown */}    
        <View style={styles.inputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Gender</Text>
          </View>
          <Dropdown
            style={[styles.dropdown, 
              { borderColor: genderFocused ? "#97DB48" : "#E0E0E0" },
            ]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={genderOptions}
            labelField="label"
            valueField="value"
            // placeholder="Gender"
            value={gender}
            onChange={(item) => setGender(item.value)}
            onFocus={() => {
              setGenderFocused(true);
              setIsDropdownFocused(true); // Expand container on focus
            }}
            onBlur={() => {
              setGenderFocused(false);
              setIsDropdownFocused(false); // Collapse container when blurred
            }}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default PersonalInformation;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 50,
    backgroundColor: "rgba(212, 240, 171, 0.53)", 
    borderRadius: 50, 
    borderWidth: 1, 
    borderColor: "#FFFFFF", 
    width: 80, 
    height: 80, 
    justifyContent: 'center', 
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    justifyContent: 'center', 
  },
  input: {
    width: '100%',
    backgroundColor: "#FFFFFF",
    padding: 14,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#A0A0A0",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    height: 50,
    backgroundColor: "#97DB48",
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignItems: "center",
    // marginTop: 20, 
    marginBottom: 30,
    width: "100%",
  },
  saveText: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
  datePicker: {
    height: 120, 
    marginTop: -50, 
  }, 
  buttonText: {
    fontSize: 14, 
    fontWeight: "500", 
    color: "#fff", 
  }, 
  button: {
    height: 50, 
    width: '40%', 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: 50, 
    marginTop: 10, 
    marginBottom: 15, 
    backgroundColor: '#075985'
  },
  pickerButton: {
    paddingHorizontal: 20, 
  }, 
  iosPickerContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    width: "100%",
    // marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  labelContainer: {
    position: "absolute",
    left: 14,
    top: -10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 4,
    zIndex: 1,
    // transition: "top 0.2s ease-in-out",
  },
  labelText: {
    fontSize: 14,
    color: "#737B98",
    fontFamily: "Poppins-Regular",
  },
  backContainer: {
    width: 45, 
    height: 45, 
    backgroundColor: '#F0F0F0',
    borderRadius: 10, 
    // marginLeft: -45, 
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
  headerContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF", // White background for header
    paddingTop: '15%',
    padding: 20, 
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
  profile: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgba(212, 240, 171, 0.53)", 
  },
  icon: {
    resizeMode: "contain",
    borderRadius: 50,  
  }
});
