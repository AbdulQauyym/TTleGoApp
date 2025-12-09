import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';

export default function SelectOrderScreen({navigation}) {
  return (
    <View style={styles.container}>
      {/* Header with HeaderScreen component */}
      <View style={styles.header}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
             </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Your Order</Text>
          <View style={styles.headerSpacer} />
        </View>
        </View>

      {/* Query Input Field - Overlapping header */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="My query isn't related to these orders"
          placeholderTextColor="#999"
          editable={true}
        />
      </View>

      <ScrollView style={styles.scrollContent}>

        {/* Order Card */}
      <View style={styles.card}>
          <View style={styles.flagRow}>
          <Image
              source={{ uri: 'https://flagcdn.com/w40/de.png' }}
            style={styles.flag}
          />
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Plan</Text>
          <Text style={styles.value}>Germany 1GB</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>Item ID</Text>
          <Text style={styles.value}>69b6***f337</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.label}>ICC ID</Text>
          <Text style={styles.value}>89103000...</Text>
        </View>
          <View style={[styles.cardRow, styles.lastCardRow]}>
          <Text style={styles.label}>Creation Time</Text>
            <Text style={styles.value}>05-Oct-2025...</Text>
        </View>
      </View>

      {/* Footer Note */}
      <Text style={styles.footerNote}>Only your latest 6 month are shown here</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    zIndex: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    flex: 1,
    marginTop: 10,
  },
  inputContainer: {
    position: 'absolute',
    top: 200,
    left: 16,
    right: 16,
    zIndex: 4,
  },
  inputField: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: -20,
    marginBottom: 16,
  },
  flagRow: {
    marginBottom: 12,
  },
  flag: { 
    width: 30, 
    height: 20, 
    resizeMode: 'contain',
    borderRadius: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastCardRow: {
    borderBottomWidth: 0,
  },
  label: { 
    color: '#333', 
    fontWeight: '600',
    fontSize: 14,
  },
  value: { 
    color: '#555',
    fontSize: 14,
  },
  footerNote: {
    color: '#CC0000',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '500',
  },
});
