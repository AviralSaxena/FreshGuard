import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { createItem } from '../../api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function ManuallyAddScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setExpiryDate(date);
    hideDatePicker();
  };

  const handlePickImage = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert("Permission Denied", "Please enable camera and photo library access.");
      return;
    }

    Alert.alert("Upload Image", "Choose upload image option", [
      {
        text: "Take Photo",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 1,
          });
          if (!result.canceled) {
            setImage(result.assets[0]);
          }
        },
      },
      {
        text: "Choose from Library",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setImage(result.assets[0]);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleAddProduct = async () => {
    if (!name || !category) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem("user");
      const parsed = stored ? JSON.parse(stored) : null;
      const userId = parsed?.userId || parsed?.id;
      if (!userId) throw new Error("User ID missing");

      const itemData = {
        itemId: Date.now().toString(),
        name,
        userId,
        category,
        expiryDate: expiryDate.toISOString(),
        quantity,
        notes: '',
        percentage: 100,
      };

      await createItem(itemData, image);
      Alert.alert('Success', `Added "${name}" to ${category}!`);
      setName('');
      setCategory(null);
      setQuantity(1);
      setImage(null);
      setExpiryDate(new Date())

      router.replace({ pathname: '/(tabs)/home', params: { reload: 'true' } });
    } catch (err) {
      console.error("Error adding product:", err);
      Alert.alert('Error', 'Failed to add product.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Add Product</Text>

          <Text style={styles.label}>Food <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter food name"
            placeholderTextColor="#A9A9A9"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Store In <Text style={styles.required}>*</Text></Text>
          <View style={styles.selectionContainer}>
            {['Pantry', 'Fridge'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.selectBox, category === option && styles.selectedBox]}
                onPress={() => setCategory(option)}
              >
                <Text style={[styles.selectText, category === option && styles.selectTextActive]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Expiry Date</Text>
          <TouchableOpacity onPress={showDatePicker} style={styles.dateBox}>
            <Text style={styles.dateText}>{expiryDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            date={expiryDate}
            minimumDate={new Date()}
            style={{ backgroundColor: '#FFF8E1' }}
          />


          <Text style={styles.label}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(prev => Math.max(1, prev - 1))}>
              <Text style={styles.quantitySymbol}>−</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(prev => prev + 1)}>
              <Text style={styles.quantitySymbol}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Upload Image</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
            {image ? (
              <Image source={{ uri: image.uri }} style={styles.uploadImage} />
            ) : (
              <Image source={require('../../assets/icons/upload.png')} style={[styles.uploadIcon, {tintColor: 'gray'}]} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 24,
  },

  // Typography
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    color: '#2D2D2D',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  required: {
    color: '#D33528',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectTextActive: {
    color: '#2C7035',
  },
  quantitySymbol: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  // Input
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderColor: '#DADADA',
    borderWidth: 1,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },

  // Store type buttons
  selectionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  selectBox: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingVertical: 14,
  },
  selectedBox: {
    backgroundColor: '#BFE89D',
    borderColor: '#97DB48',
  },

  // Date Picker
  dateBox: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
  },

  // Quantity Controls
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 20,
  },
  quantityButton: {
    backgroundColor: '#E6E6E6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  // Image Upload
  uploadBox: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    alignSelf: 'center',
    marginVertical: 20,
  },
  uploadImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  uploadIcon: {
    width: '70%',
    height: '70%',
  },
  // Submit Button
  button: {
    backgroundColor: '#97DB48',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: '#E6E6E6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 20,
    fontWeight: '600',
  },
});
