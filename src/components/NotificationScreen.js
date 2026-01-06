import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import HeaderScreen from './Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { scaleSize, scaleFont, widthPercentage, heightPercentage } from '../utils/dimensions';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function NotificationScreen({ navigation }) {
  const { language } = useLanguage();
  const t = (key) => translate(language, key);

  // Sample notifications data - replace with actual data from API/state
  const [notifications] = useState([
    {
      id: 1,
      title: 'New eSIM Package Available',
      message: 'Check out our new data plans for Thailand with 50% off!',
      time: '2 hours ago',
      type: 'promotion',
      read: false,
    },
    {
      id: 2,
      title: 'Order Confirmed',
      message: 'Your eSIM order for Japan has been confirmed and is ready to use.',
      time: '1 day ago',
      type: 'order',
      read: false,
    },
    {
      id: 3,
      title: 'Data Usage Alert',
      message: 'You have used 80% of your data plan. Consider upgrading.',
      time: '2 days ago',
      type: 'alert',
      read: true,
    },
    {
      id: 4,
      title: 'Welcome Bonus',
      message: 'Get 1GB free data on your first purchase!',
      time: '3 days ago',
      type: 'promotion',
      read: true,
    },
  ]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'promotion':
        return 'pricetag-outline';
      case 'order':
        return 'checkmark-circle-outline';
      case 'alert':
        return 'warning-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'promotion':
        return '#FFC107';
      case 'order':
        return '#4CAF50';
      case 'alert':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.headerTitle}>{t('notifications.title') || 'Notifications'}</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.bannerContainer}>
          <HeaderScreen />
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.notificationsList}
        contentContainerStyle={styles.notificationsContent}
        showsVerticalScrollIndicator={true}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {t('notifications.noNotifications') || 'No notifications yet'}
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.read && styles.notificationItemUnread
              ]}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: getNotificationColor(notification.type) + '20' }
              ]}>
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  size={24}
                  color={getNotificationColor(notification.type)}
                />
              </View>
              <View style={styles.notificationContent}>
                <View style={styles.notificationHeader}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.notificationTitleUnread
                  ]}>
                    {notification.title}
                  </Text>
                  {!notification.read && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>
                  {notification.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: "#CC0000",
    paddingVertical: 0,
    alignItems: "center",
    overflow: 'hidden',
    resizeMode: 'contain',
    zIndex: 0,
    height: 300,
    margin: 0,
    padding: 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    zIndex: 2,
    position: 'absolute',
    top: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  bannerContainer: {
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -120,
    zIndex: 10,
  },
  notificationsContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  notificationItemUnread: {
    backgroundColor: '#F5F5F5',
    borderColor: '#CC0000',
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    fontFamily: 'Poppins',
  },
  notificationTitleUnread: {
    fontWeight: 'bold',
    color: '#000',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CC0000',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: 'Poppins',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Poppins',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    fontFamily: 'Poppins',
  },
});









