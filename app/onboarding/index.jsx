import { FlatList, SafeAreaView, StyleSheet, View , Animated, Platform} from 'react-native';
import React, { useRef, useState } from 'react';
import slides from '../../constants/slides';
import OnBoardingItem from './items';
import Paginator from './paginator';
import CustomButton from '../../component/CustomButton'

export default function OnBoarding() {
  const [currentIndex, setCurrentIndex] = useState(0); 
  const scrollX = useRef(new Animated.Value(0)).current; 
  const slidesRef = useRef(null); 

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);  
  }).current; 

  const viewConfig = useRef(({ viewAreaCoveragePercentThreshold: 50 })).current; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paginator}>
        <Paginator data={slides} scrollX={scrollX}/>
      </View>
      <View style={{ flex: 3 }}>
        <FlatList 
          data={slides} 
          renderItem={ ({ item }) => <OnBoardingItem item={item} /> } 
          horizontal
          showsHorizontalScrollIndicator
          pagingEnabled
          bouces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x:scrollX }}}], {
            useNativeDriver: false,  
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
        />
      </View>
      <View style={styles.button}>
        <CustomButton title="Getting Started" route='/sign-in'/>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignContent: 'center', 
  }, 
  paginator: {
    marginTop:20
  }, 
  button: {
    marginBottom: Platform.OS === 'ios' ? 30 : 70, 
    paddingHorizontal: 30, 
  }
})