import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView } from 'react-native';

const notifications = [
  {
    id: '1',
    title: 'Food Expiring Soon',
    message: 'Your milk is expiring in 2 days.',
    icon: require('../../assets/icons/alert.png'),
  },
  {
    id: '2',
    title: 'New Recipe Available',
    message: 'You can make pancakes with your expiring eggs!',
    icon: require('../../assets/icons/recipe.png'),
  },
  {
    id: '3',
    title: 'FreshGuard Tip',
    message: 'Keep fruits in the fridge to last longer.',
    icon: require('../../assets/icons/tip.png'),
  },
];

export default function NotificationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.icon} style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMessage}>{item.message}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    color: '#222',
    padding: 20, 
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 12,
    tintColor: '#97DB48',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
