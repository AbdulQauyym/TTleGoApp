import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderScreen from './Header';
import { sendInviteEmail } from '../services/api';


export default function InviteFriendsScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFriend = async () => {
    // Validate email
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Try to send via API first
      try {
        await sendInviteEmail({
          email: email.trim(),
          name: name.trim() || undefined,
        });

        Alert.alert(
          'Success',
          `Invite email has been sent to ${email.trim()}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form after successful send
                setEmail('');
                setName('');
              },
            },
          ]
        );
      } catch (apiError) {
        // Fallback: Open email client with pre-filled content
        const subject = encodeURIComponent('eSIM Invitation');
        const body = encodeURIComponent(
          `Hello${name.trim() ? ` ${name.trim()}` : ''},\n\n` +
          `I'm inviting you to try our eSIM service. You will receive detailed installation instructions via email.\n\n` +
          `Please note: Once an eSIM is installed on a device, it cannot be transferred or reinstalled on another device.\n\n` +
          `Best regards`
        );
        const mailtoUrl = `mailto:${email.trim()}?subject=${subject}&body=${body}`;

        const canOpen = await Linking.canOpenURL(mailtoUrl);
        if (canOpen) {
          await Linking.openURL(mailtoUrl);
          Alert.alert(
            'Email Client Opened',
            'Please send the email from your email client.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Clear form
                  setEmail('');
                  setName('');
                },
              },
            ]
          );
        } else {
          Alert.alert(
            'Error',
            'Unable to open email client. Please check your email configuration.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to send invite email. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <HeaderScreen />
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
          <View style={styles.headerSpacer} />
        </View>
      </View> 
        

      <ScrollView contentContainerStyle={styles.content}>
        {/* Instruction */}
        <View>
  <Text style={styles.instruction}>
          You could send this eSIM to your friend. Your friend will receive an email containing detailed installation instruction
        </Text>
        </View>
      

        {/* Email Input */}
        <View>
<Text style={styles.label}>Email Address</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        {/* Name Input */}
        <View><Text style={styles.label}>Name (optional)</Text></View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Note */}
        <Text style={styles.note}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>Please note:</Text> Once this eSIM is installed on a device it cannot be transferred or reinstalled on another device. Before proceeding, please ensure that the provided email address is correct
        </Text>

        {/* Add Button */}
        <TouchableOpacity 
          style={[styles.addButton, loading && styles.addButtonDisabled]}
          onPress={handleAddFriend}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.addButtonText}>Sending...</Text>
            </View>
          ) : (
            <Text style={styles.addButtonText}>Add Friend</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  backButton: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 8,
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
    paddingVertical:50
    
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
    zIndex:2
  },
  instruction: {
    fontSize: 14,
    color: '#100202ff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 0,
    zIndex: 2
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  note: {
    fontSize: 13,
    color: '#555',
    marginVertical: 20,
    lineHeight: 18,
  },
  addButton: {
    backgroundColor: '#CC0000',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
