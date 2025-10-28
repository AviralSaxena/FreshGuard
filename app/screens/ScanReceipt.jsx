import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { createItem } from '../../api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function ScanReceiptScreen() {
  const { scannedData, imageUri } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());

  useEffect(() => {
    if (scannedData && imageUri) {
      try {
        const parsedData = JSON.parse(scannedData);
        setStoreName(parsedData.Store || '');
        setTotalAmount(parsedData.Total || '');
        if (parsedData.Date) {
          setPurchaseDate(new Date(parsedData.Date));
        }
        setName(parsedData.Store || '');
        setImage({ uri: imageUri });
      } catch (error) {
        console.error("Error parsing scanned data:", error);
      }
    }
  }, [scannedData, imageUri]);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setExpiryDate(date);
    hideDatePicker();
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
        notes: `Purchased from: ${storeName}\nTotal: ${totalAmount}\nDate: ${purchaseDate.toLocaleDateString()}`,
        percentage: 100,
      };

      await createItem(itemData, image);
      Alert.alert('Success', `Added "${name}" to ${category}!`);
      resetForm();
      router.replace({ pathname: '/(tabs)/home', params: { reload: 'true' } });
    } catch (err) {
      console.error("Error adding product:", err);
      Alert.alert('Error', 'Failed to add product.');
    }
  };

  const resetForm = () => {
    setName('');
    setCategory(null);
    setQuantity(1);
    setImage(null);
    setExpiryDate(new Date());
    setStoreName('');
    setTotalAmount('');
    setPurchaseDate(new Date());
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Add Scanned Item</Text>

          <Text style={styles.label}>Receipt Image</Text>
          {image && (
            <Image source={{ uri: image.uri }} style={styles.receiptImage} />
          )}

          {storeName && (
            <View style={styles.receiptInfo}>
              <Text style={styles.receiptLabel}>Store: {storeName}</Text>
              <Text style={styles.receiptLabel}>Total: {totalAmount}</Text>
              <Text style={styles.receiptLabel}>Date: {purchaseDate.toLocaleDateString()}</Text>
            </View>
          )}

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

          <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
            <Text style={styles.buttonText}>Add Product</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace('/(tabs)/home')}>
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
  selectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectTextActive: {
    color: '#2C7035',
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
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
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  receiptInfo: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  receiptLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
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
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
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