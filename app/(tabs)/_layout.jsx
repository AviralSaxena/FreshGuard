import React, { useState } from 'react';
import { View, Image, StyleSheet, Platform, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Tabs, useRouter } from 'expo-router';
import { icons } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

const TabIcon = ({ icon, focusedIcon, color, focused, isScan, showScanOptions }) => {
  const iconSource = isScan
    ? showScanOptions
      ? icons.close
      : icons.scanfill
    : focused
    ? focusedIcon
    : icon;

  return (
    <View
      style={[
        styles.iconContainer,
        isScan && !showScanOptions ? styles.scanTabInactive : {},
        isScan && showScanOptions ? styles.scanTabActive : {},
      ]}
    >
      {isScan && showScanOptions ? (
        <LinearGradient
          colors={['#D3D3D3', '#A9A9A9']} // Gray gradient for close button
          style={styles.closeButtonContainer}
        >
          <Image source={icons.close} resizeMode="contain" style={styles.closeIcon} />
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={isScan ? ['#ACDB7E', '#74C365'] : ['#FFFFFF', '#FFFFFF']}
          style={styles.gradientContainer}
        >
          <Image
            source={iconSource}
            resizeMode="contain"
            style={[
              isScan ? styles.scanIconFill : { width: 35, height: 35, tintColor: focused ? '#555555' : color },
            ]}
          />
        </LinearGradient>
      )}
    </View>
  );
};

const CustomTabBar = ({ toggleScanOptions, showScanOptions }) => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#555555',
          tabBarInactiveTintColor: '#8D8D8D',
          tabBarStyle: styles.tabBarStyle,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} focusedIcon={icons.homefill} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="recipe"
          options={{
            title: 'Recipe',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.recipebook} focusedIcon={icons.recipefill} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="scan"
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Prevents normal navigation
              toggleScanOptions();
            },
          }}
          options={{
            title: 'Scan',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.scan}
                focusedIcon={icons.scanfill}
                color={color}
                focused={focused}
                isScan={true}
                showScanOptions={showScanOptions}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notification"
          options={{
            title: 'Notification',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.notification}
                focusedIcon={icons.notificationfill}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Wallet',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.wallet} focusedIcon={icons.walletfill} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

const MainLayout = () => {
  const router = useRouter();
  const [showScanOptions, setShowScanOptions] = useState(false);

  const toggleScanOptions = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowScanOptions((prev) => !prev);
  };

  return (
    <>
      {showScanOptions && (
        <TouchableWithoutFeedback onPress={() => setShowScanOptions(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {showScanOptions && (
        <View style={styles.scanOptions}>
          <LinearGradient colors={['#174B37', '#3C9A59']} style={styles.floatingButton}>
            <TouchableOpacity
              onPress={() => {
                setShowScanOptions(false);
                router.push('./../screens/ManuallyAdd');
              }}
            >
              <Image source={icons.plusfill} style={[styles.iconStyle, { width: 25, height: 25}]} />
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient colors={['#ACDB7E', '#74C365']} style={styles.floatingButton}>
            <TouchableOpacity
              onPress={() => {
                setShowScanOptions(false);
                router.push('./../screens/ScanItem');
              }}
            >
              <Image source={icons.scanfill} style={styles.iconStyle} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      <View style={styles.container}>
        <CustomTabBar toggleScanOptions={toggleScanOptions} showScanOptions={showScanOptions} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  tabBarStyle: {
    height: 60,
    width: '95%',
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: '6%',
    alignSelf: 'center',
    zIndex: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    top: Platform.OS === 'ios' ? '10%' : '-50%',
  },
  gradientContainer: {
    height: 52,
    width: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  scanTabInactive: {
    backgroundColor: 'rgba(172, 219, 126, 0.81)',
  },
  scanTabActive: {
    backgroundColor: '#D3D3D3',
  },
  closeButtonContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  scanIconFill: {
    tintColor: '#FFFFFF',
    width: 35,
    height: 35,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
    elevation: 2,
  },
  scanOptions: {
    position: 'absolute',
    bottom: '12%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 30,
    paddingHorizontal: 10,
    gap: 5,
  },
  floatingButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    zIndex: 30,
  },
  iconStyle: {
    width: 35,
    height: 35,
    tintColor: 'white',
  },
});

export default MainLayout;