import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable, Alert, Dimensions, Image, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get("window");

export default function ScanItems() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState('off');
  const [cameraType, setCameraType] = useState('back'); 
  const [isScanning, setIsScanning] = useState(false); 
  const cameraRef = useRef(null);

  if (!permission) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFlashMode = () => {
    setFlashMode(flashMode === 'off' ? 'on' : 'off');
  };

  const toggleCameraType = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back');
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setIsScanning(true); 

      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        name: 'receipt.jpg',
        type: 'image/jpeg',
      });

      try {
        const response = await fetch('http://192.168.1.187:5241/api/receipt/scan', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await response.json();
        setIsScanning(false);
        
        // Navigate to ScanReceipt with the scanned data
        router.push({
          pathname: '/screens/ScanReceipt',
          params: {
            scannedData: JSON.stringify(data),
            imageUri: photo.uri
          }
        });
      } catch (error) {
        console.error("Error scanning receipt:", error);
        Alert.alert("Error", "Failed to scan the receipt. Please try again.");
        setIsScanning(false);
      }
    }
  };

  const closeCamera = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={cameraType} flash={flashMode}>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.iconButton} onPress={closeCamera}>
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>

          <View style={styles.topRightIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleFlashMode}>
              <Ionicons name={flashMode === 'on' ? 'flash' : 'flash-off'} size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={toggleCameraType}>
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomControls}>
          <LinearGradient colors={['#B6E388', '#4CAF50']} style={styles.captureButtonBorder}>
            <Pressable style={styles.captureButton} onPress={takePhoto}>
              <FontAwesome name="camera" size={35} color="white" />
            </Pressable>
          </LinearGradient>
        </View>
      </CameraView>

      {isScanning && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#97DB48" />
          <Text style={styles.loadingText}>Processing food image...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  camera: { 
    flex: 1 
  },
  topControls: {
    position: 'absolute',
    top: height * 0.065, 
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRightIcons: { 
    flexDirection: 'row', 
    gap: 15 
  },
  bottomControls: {
    position: 'absolute',
    bottom: '7%',
    width: '100%',
    alignItems: 'center',
  },
  captureButtonBorder: {
    width: 80,
    height: 80,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(182, 227, 136, 0.3)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: { 
    fontSize: 18, 
    marginBottom: 10 
  },
  permissionButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: { 
    color: 'white' 
  },
});