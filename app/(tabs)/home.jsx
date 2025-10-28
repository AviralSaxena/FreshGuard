import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import ProfileIcon from "../../component/ProfileIcon";
import { fetchItemByUsersId, deleteItem } from "../../api";
import { images } from "../../constants";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SwipeListView } from 'react-native-swipe-list-view';

const Home = () => {
  const [selectedTab, setSelectedTab] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { reload } = useLocalSearchParams();
  const router = useRouter(); 

  useEffect(() => {
    const loadItems = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const userId = user?.userId;

        if (!userId) throw new Error("UserId is not found");

        const data = await fetchItemByUsersId(userId);
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, [reload]); 

  const handleDelete = async (id) => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userId = user?.userId;

      if (!userId) throw new Error("UserId is not found");

      const data = await fetchItemByUsersId(userId);
      
      const success = await deleteItem(id, userId); 

      if (success) {
        const update = items.filter(item => item.id !== id); 
        setItems(update); 
      }
    } catch (err) {
      console.error("Delete failed: ", err);
    }
  }; 

  const handleUpdateItem = (itemId) => {
    router.push({
      pathname: "./../screens/EditItem", 
      params: {itemId}
    }); 
  }; 
  
  const getFilteredData = () => {
    return selectedTab === "All"
      ? items
      : items.filter(
          (item) => item.category.toLowerCase() === selectedTab.toLowerCase()
        );
  };

  const getStrokeColor = (percentage) => {
    if (percentage > 70) return "#97DB48";
    if (percentage > 50) return "#BFE89D";
    if (percentage > 40) return "#DEDB2F";
    if (percentage > 30) return "#FFB84D";
    return "#FF5733";
  };

  const getStrokeLength = (percentage) => {
    const total = 2 * Math.PI * 50;
    const filled = Math.round((percentage / 100) * total);
    return total - filled;
  };

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };


  const renderItem = ({ item }) => {
    const percentage = item.percentage;
    const strokeColor = getStrokeColor(percentage);
    const strokeLength = getStrokeLength(percentage);
    const uploadedDate = formatDate(item.uploadedDate);
    const expiryDate = formatDate(item.expiryDate);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.circleWrapper}>
          <Svg height="120" width="120" viewBox="0 0 120 120">
            <Circle cx="60" cy="60" r="50" stroke="#E5E5E5" strokeWidth="5" fill="none" />
            <Circle
              cx="60"
              cy="60"
              r="50"
              stroke={strokeColor}
              strokeOpacity={0.5}
              strokeWidth="5"
              fill="none"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={strokeLength}
              strokeLinecap="round"
              rotation="90"
              origin="60,60"
            />
          </Svg>
          <Image 
            source={item.imageUrl ? { uri: item.imageUrl } : images.egg} 
            style={styles.itemImage} />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.dateText}>Product added: {uploadedDate}</Text>
          <Text style={styles.dateText}>Product expires: {expiryDate}</Text>
        </View>
      </View>
    );
  };

  const renderRightActions = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 160}}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#d4cfcf' }]}
        onPress={() => {console.log("Edit", item.id), handleUpdateItem(item.itemId)}}
      >
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#f20707', borderTopRightRadius: 10 , borderBottomRightRadius: 10}]}
        onPress={() => { console.log("Delete", item.name), handleDelete(item.id)}}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  ); 

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <ProfileIcon route="/profile" />
        <View style={styles.textContainer}>
          {["All", "Pantry", "Fridge"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <View style={styles.textWrapper}>
                <Text style={[styles.text, selectedTab === tab && styles.textSelected]}>
                  {tab}
                </Text>
                <View
                  style={[
                    styles.underline,
                    selectedTab === tab && styles.underlineSelected,
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#97DB48" style={{ marginTop: 20 }} />}
      {error && <Text style={{ textAlign: "center", color: "red" }}>{error}</Text>}

      {!loading && !error && (
        <SwipeListView
          data={getFilteredData()}
          keyExtractor={(item) => item.itemId}
          renderItem={renderItem}
          renderHiddenItem={renderRightActions}
          rightOpenValue={-200}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 22,
    paddingHorizontal: 10,
    color: "#737B98",
  },
  textSelected: {
    color: "#97DB48",
  },
  textWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  underline: {
    width: "75%",
    borderBottomWidth: 1,
    borderColor: "transparent",
    marginTop: -3,
  },
  underlineSelected: {
    borderColor: "#97DB48",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    borderWidth: 0.1, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  circleWrapper: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    position: "absolute",
  },
  itemDetails: {
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    marginBottom: 10, 
  },
  dateText: {
    fontFamily: 'Poppins-Medium', 
    fontSize: 12,
    color: "#737B98",
  },
  actionButton: {
    // height: '100%',
    // // paddingTop: , 
    // marginVertical: 10,
    // justifyContent: 'center', 
    // alignItems: 'center', 
    padding: 25,
    alignItems: "center",
    justifyContent: 'center', 
    // paddingTop: 10,
    marginVertical: 10,
    width: 100, 
  },
  actionText: {
    color: '#FFF',
    fontFamily: 'Poppins-Medium', 
    fontSize: 15,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: 'center', 
  },
});
