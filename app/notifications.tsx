import BackButton from '@/components/back-button';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Notifications() {
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: false,
    orderUpdates: true,
    promotional: false,
    priceAlerts: true,
    newArrivals: false,
    securityAlerts: true,
    newsletter: false,
  });

  const toggleSwitch = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationGroups = [
    {
      title: 'Push Notifications',
      items: [
        {
          key: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive push notifications on your device',
        },
        {
          key: 'orderUpdates',
          title: 'Order Updates',
          description: 'Get updates about your orders and deliveries',
        },
        {
          key: 'priceAlerts',
          title: 'Price Alerts',
          description: 'Notify me when items on my wishlist go on sale',
        },
        {
          key: 'securityAlerts',
          title: 'Security Alerts',
          description: 'Important security and account notifications',
        },
      ],
    },
    {
      title: 'Email Notifications',
      items: [
        {
          key: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Receive email notifications',
        },
        {
          key: 'promotional',
          title: 'Promotional Emails',
          description: 'Special offers, discounts and promotions',
        },
        {
          key: 'newArrivals',
          title: 'New Arrivals',
          description: 'Get notified about new products',
        },
        {
          key: 'newsletter',
          title: 'Newsletter',
          description: 'Weekly newsletter with curated content',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
       <BackButton/>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notification Summary */}
        <View style={styles.summaryCard}>
          <Ionicons name="notifications" size={32} color="#FF6B35" />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Notification Settings</Text>
            <Text style={styles.summaryText}>
              Manage how you receive notifications and updates
            </Text>
          </View>
        </View>

        {/* Notification Groups */}
        {notificationGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            <View style={styles.settingsContainer}>
              {group.items.map((item, itemIndex) => (
                <View
                  key={item.key}
                  style={[
                    styles.settingItem,
                    itemIndex === group.items.length - 1 && { borderBottomWidth: 0 }
                  ]}
                >
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingName}>{item.title}</Text>
                    <Text style={styles.settingDescription}>
                      {item.description}
                    </Text>
                  </View>
                  <Switch
                    value={notifications[item.key]}
                    onValueChange={() => toggleSwitch(item.key)}
                    trackColor={{ false: '#f0f0f0', true: '#FF6B35' }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Quiet Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <View style={styles.quietHoursCard}>
            <View style={styles.quietHoursInfo}>
              <Ionicons name="moon-outline" size={24} color="#666" />
              <View style={styles.quietHoursContent}>
                <Text style={styles.quietHoursTitle}>Do Not Disturb</Text>
                <Text style={styles.quietHoursText}>
                  Mute notifications during specified hours
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.configureButton}>
              <Text style={styles.configureButtonText}>Configure</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notification History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyContainer}>
            {[
              {
                id: 1,
                title: 'Order Shipped',
                message: 'Your order #90897 has been shipped',
                time: '2 hours ago',
                read: false,
                icon: 'cube-outline',
              },
              {
                id: 2,
                title: 'Price Drop',
                message: 'Items in your wishlist are now on sale',
                time: '1 day ago',
                read: true,
                icon: 'pricetag-outline',
              },
              {
                id: 3,
                title: 'Welcome Bonus',
                message: 'Get 20% off your first order',
                time: '2 days ago',
                read: true,
                icon: 'gift-outline',
              },
            ].map((notification) => (
              <View
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.unreadNotification
                ]}
              >
                <View style={styles.notificationIcon}>
                  <Ionicons
                    name={notification.icon}
                    size={20}
                    color={notification.read ? '#999' : '#FF6B35'}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.unreadTitle
                  ]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {notification.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Save Settings Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryContent: {
    flex: 1,
    marginLeft: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
  },
  quietHoursCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quietHoursInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quietHoursContent: {
    flex: 1,
    marginLeft: 12,
  },
  quietHoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  quietHoursText: {
    fontSize: 12,
    color: '#666',
  },
  configureButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 6,
  },
  configureButtonText: {
    color: '#FF6B35',
    fontSize: 14,
    fontWeight: '600',
  },
  historyContainer: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#FFF5F2',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  notificationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  unreadTitle: {
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});