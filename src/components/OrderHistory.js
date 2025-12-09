import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';



export default function OrderHistoryScreen({navigation}) {
  const orderDetails = {
    plan: 'Trial',
    orderId: 'Ending with f337',
    date: '05-Oct-2025',
    status: 'Completed',
    items: 1,
    price: 'USD 0',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff"/>
        </TouchableOpacity>
 <Text style={styles.headerTitle}>Order History</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Order Card */}
        <View style={styles.card}>
          <Text style={styles.plan}>{orderDetails.plan}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>{orderDetails.orderId}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{orderDetails.date}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{orderDetails.status}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Item(s)</Text>
            <Text style={styles.value}>{orderDetails.items}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: 'red' }]}>Status</Text>
            <Text style={styles.value}>{orderDetails.price}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'relative',
  },
  headerContent: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
    zIndex: 10,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    padding: 16,
    marginTop: -80,
    zIndex: 5,
  },
  plan: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
});