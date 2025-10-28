import React from 'react'
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native'

export default OnBoardingItem = ({ item }) => {
    const { width } = useWindowDimensions(); 
     
  return (
    <View style={[styles.container, {width}]}>
      <Image source={item.image} style={[styles.images, { width, resizeMode: 'contain' }]} />
      
      <View style={{ flex: 0.3 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center',
        alignContent: 'center', 
        
    }, 
    images: {
        flex: 0.4, 
        justifyContent: 'center',
        alignContent: 'center', 
    }, 
    title: {
        fontFamily: 'Poppins-Bold',
        fontSize: 22, 
        marginBottom: 10, 
        color: '#000000', 
        textAlign: 'center', 
        marginHorizontal: 10, 
    }, 
    description: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16, 
        textAlign: 'center', 
        paddingHorizontal: 60, 
    }, 
})