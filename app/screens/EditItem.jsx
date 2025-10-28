import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView, 
  Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from "expo-image-picker";
import { fetchItemByUsersId, updateItem } from "./../../api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "../../constants";

const EditScreen = () => {
    const { itemId } = useLocalSearchParams();
    const router = useRouter();
    const [item, setItem] = useState(null);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(null);
    const [notes, setNotes] = useState("");
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [file, setFile] = useState(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);

    const notesRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            notesRef.current?.focus();
        }, 500); // slight delay ensures screen renders first
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchItem = async () => {
        const storedUser = await AsyncStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.userId;
        if (!userId) return;

        const items = await fetchItemByUsersId(userId);
        const matched = items.find((i) => i.itemId === itemId);
        if (!matched) return;

        setItem(matched);
        setName(matched.name);
        setCategory(matched.category);
        setQuantity(Number(matched.quantity));
        setExpiryDate(new Date())
        setNotes(matched.notes)
        };

        fetchItem();
    }, []);

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

    const handleSave = async () => {
        try {
        const storedUser = await AsyncStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.userId;

        if (!userId || !item?.id) throw new Error("Missing user or item ID");

        const updateData = {
            name: name.trim(),
            category,
            quantity: parseInt(quantity),
            expiryDate: expiryDate.toISOString(),
        };

        await updateItem(item.id, userId, updateData, file);
        Alert.alert("Success", "Successfully updated the item");
        router.replace({ pathname: "/(tabs)/home", params: { reload: Date.now().toString() } });
        } catch (error) {
        console.error("Error updating item:", error.toJSON?.() || error.message);
        Alert.alert("Error", error.message || "Failed to update item.");
        }
    };

    if (!item) {
        return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Loading item...</Text>
        </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View>
                <Image
                    source={{ uri: file?.uri || item.imageUrl }}
                    style={{ width: "100%", height: 250 }}
                />
                <TouchableOpacity
                    onPress={handlePickImage}
                    style={{ 
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        backgroundColor: "#fff",
                        borderRadius: 10,
                        padding: 8,
                        zIndex: 1,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 3,
                    }}
                >
                    <Image source={icons.camera} style={{ width: 24, height: 24, tintColor: "#333" }} />
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput style={styles.input} value={name} onChangeText={setName} />

                    <Text style={styles.label}>Store In</Text>
                    <View style={styles.selectionContainer}>
                    {["Pantry", "Fridge"].map((option) => (
                        <TouchableOpacity
                        key={option}
                        style={[styles.selectBox, category === option && styles.selectedBox]}
                        onPress={() => setCategory(option)}
                        >
                        <Text style={[styles.selectText, category === option && styles.selectTextActive]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                    </View>

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

                    <Text style={styles.label}>Expiration Date</Text>
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

                    <Text style={styles.label}>Notes</Text>
                    <TextInput 
                        style={styles.noteInput} 
                        value={notes} 
                        onChangeText={setNotes} 
                        multiline={true}
                        ref={notesRef}
                    />

                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20, }}>Save Changes</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default EditScreen;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#FAFAFA'
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#555",
        marginBottom: 8,
    },
    saveButton: {
        backgroundColor: '#97DB48',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginTop: 20,
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
    dateBox: {
        borderWidth: 1,
        borderColor: '#DADADA',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FAFAFA',
    },
    noteInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#FAFAFA', 
        height: 120, 
        textAlignVertical: 'top', 
    }
});