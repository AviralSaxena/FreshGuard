// Regarding the Splash Screen of the Application

import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { LinearGradient } from 'expo-linear-gradient'; 
import { useRouter } from 'expo-router';
import { StatusBar } from 'react-native';

export default function App() {
  const router = useRouter(); 
  const fade = useRef(new Animated.Value(1)).current  // Start with the full opacity 
  useEffect(() => {
    // Set the timeout for 3 second, then navigate to the onboarding screen
    const timer = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,    // Fade to 0 opacity
        duration: 500, 
        useNativeDriver: true,      
      }).start(() => {
        // After the animation completed, move to onboarding screen
        router.replace('/onboarding')
      });
    }, 2000); // Wait 2 sec to fade

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer)
  }, []); 

  return (
    <>
      <StatusBar
      barStyle={'dark-content'}
      />
      <Animated.View style={[styles.container, {opacity: fade}]}>
        <LinearGradient
          colors={['#8BAA87', '#3D4B3D']}
          locations={[0, 0.8]}
          style={styles.gradientBackground}
          start={{ x:0, y:0 }} // Start of the gradient (top left)
          end={{ x:0, y:1}}    // End of the gradient (bottom)
        > 
          <SafeAreaView style={styles.safeArea}>
              <View style={styles.content}>
                <Image
                  source={images.logotransparent}
                  style={[styles.logo, styles.shadow]}
                  resizeMode='contain'
                />
              </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,                    
  },
  content: {
    width: '100%',  
    justifyContent: 'center', 
    alignItems: 'center',       // Centers content horizontally
    flex: 1,                    // Make the View take the full height
    paddingHorizontal: 16,  
  },
  logo: {
    width: 311.66, 
    height: 300,  
  },
  shadow: {
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, 
    shadowRadius: 10, 
    elevation: 10, 
  }
});