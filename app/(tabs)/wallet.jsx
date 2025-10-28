import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function WalletScreen() {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Text style={styles.header}>Cashbacks</Text>
      <Text style={styles.balanceLabel}>Current Balance</Text>
      <Text style={styles.balance}>$15.23</Text>

      {/* Redeem Button */}
      <TouchableOpacity style={styles.redeemButton}>
        <Text style={styles.redeemText}>Redeem</Text>
      </TouchableOpacity>

      {/* Transactions Section */}
      <View style={styles.transactionContainer}>
        <Text style={styles.transactionTitle}>Recent Transactions</Text>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Image source={item.logo} style={styles.storeLogo} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionStore}>
                  {item.store} <Text style={styles.transactionType}>{item.type}</Text>
                </Text>
                <Text style={styles.transactionReceipt}>RECEIPT: {item.receipt}</Text>
                <Text style={styles.transactionDate}>Disbursed: {item.disburseDate}</Text>
              </View>
              <Text style={[styles.transactionAmount, { color: item.amountColor }]}>
                {item.amount}
              </Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        {/* See All Button */}
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All Transactions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: '12%',
    paddingHorizontal: '3.5%',
    paddingVertical: '5%',
    width: '100%'
  },
  header: {
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    color: '#222',
    paddingTop: '7%'
  },
  balanceLabel: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 4,
  },
  balance: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginTop: 6,
  },
  redeemButton: {
    backgroundColor: '#A4DC64',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  redeemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  transactionContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  storeLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionStore: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  transactionType: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  transactionReceipt: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  seeAllButton: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 16,
    alignSelf: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22C55E',
  },
});

const transactions = [
  {
    id: '1',
    store: 'Walmart',
    type: 'CASHBACK',
    receipt: '143BD423 11/19',
    amount: '+$4.67',
    disburseDate: '11/22',
    logo: require('../../assets/icons/walmart.png'),
    amountColor: '#10B981',
  },
  {
    id: '2',
    store: 'Redeem',
    type: 'CASHBACK',
    receipt: '1324718401 11/19',
    amount: '-$5.00',
    disburseDate: '11/22',
    logo: require('../../assets/icons/redeem.png'),
    amountColor: '#EF4444',
  },
  {
    id: '3',
    store: 'Costco',
    type: 'CASHBACK',
    receipt: '276HCOO2 11/12',
    amount: '+$3.15',
    disburseDate: '11/22',
    logo: require('../../assets/icons/costco.png'),
    amountColor: '#10B981',
  },
  {
    id: '4',
    store: 'Target',
    type: 'CASHBACK',
    receipt: '207OA004 11/05',
    amount: '+$3.15',
    disburseDate: '11/22',
    logo: require('../../assets/icons/target.png'),
    amountColor: '#10B981',
  },
];
