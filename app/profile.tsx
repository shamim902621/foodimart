import BackButton from '@/components/back-button';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  });

  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    order: true,
    promotional: false,
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  const menuItems = [
    {
      icon: 'person-outline',
      name: 'Personal Details',
      action: () => router.push('/personal-details'),
    },
    {
      icon: 'location-outline',
      name: 'My Addresses',
      action: () => router.push('/address'),
    },
    {
      icon: 'receipt-outline',
      name: 'My Orders',
      action: () => router.push('/order'),
    },
    {
      icon: 'heart-outline',
      name: 'Wishlist',
      action: () => router.push('/wishlist'),
    },
    {
      icon: 'notifications-outline',
      name: 'Notifications',
      action: () => router.push('/notifications'),
    },
    {
      icon: 'lock-closed-outline',
      name: 'Security',
      action: () => handleSecurity(),
    },
    {
      icon: 'help-circle-outline',
      name: 'Help & Support',
      action: () => router.push('/help'),
    },
    {
      icon: 'information-circle-outline',
      name: 'About',
      action: () => router.push('/about'),
    },
  ];

  const stats = [
    { label: 'Orders', value: '12', icon: 'receipt' },
    { label: 'Wishlist', value: '8', icon: 'heart' },
    { label: 'Coupons', value: '3', icon: 'tag' },
    { label: 'Reviews', value: '7', icon: 'star' },
  ];

  const handleEditField = (field: any, value: any) => {
    setEditField(field);
    setEditValue(value);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setUser(prev => ({ ...prev, [editField]: editValue }));
    setShowEditModal(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleSecurity = () => {
    Alert.alert(
      'Security Options',
      'Choose an option',
      [
        {
          text: 'Change Password',
          onPress: () => router.push('/forgot-password'),
        },
        {
          text: 'Forgot Password',
          onPress: () => setShowForgotPasswordModal(true),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(false);
    Alert.alert('Success', 'Password reset link sent to your email!');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("authToken");
              await AsyncStorage.removeItem("userData");
              router.replace("/login");
            } catch (error) {
              console.error("Error clearing storage during logout:", error);
            }
          },
        },
      ]
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Feather name="edit-3" size={20} color="#328a0dff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Feather name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <View style={styles.statIcon}>
                  <Ionicons name={stat.icon} size={20} color="#FF6B35" />
                </View>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Info Cards */}
        <View style={styles.cardsSection}>
          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => handleEditField('name', user.name)}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="person" size={20} color="#328a0dff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Full Name</Text>
              <Text style={styles.cardValue}>{user.name}</Text>
            </View>
            <Feather name="edit-2" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => handleEditField('email', user.email)}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="mail" size={20} color="#328a0dff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Email Address</Text>
              <Text style={styles.cardValue}>{user.email}</Text>
            </View>
            <Feather name="edit-2" size={16} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoCard}
            onPress={() => handleEditField('phone', user.phone)}
          >
            <View style={styles.cardIcon}>
              <Ionicons name="call" size={20} color="#328a0dff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Phone Number</Text>
              <Text style={styles.cardValue}>{user.phone}</Text>
            </View>
            <Feather name="edit-2" size={16} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.settingsContainer}>
            {Object.entries(notifications).map(([key, value]) => (
              <View key={key} style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingName}>
                    {key.charAt(0).toUpperCase() + key.slice(1)} Notifications
                  </Text>
                  <Text style={styles.settingDescription}>
                    Receive {key} notifications about your orders
                  </Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={(newValue) =>
                    setNotifications(prev => ({ ...prev, [key]: newValue }))
                  }
                  trackColor={{ false: '#f0f0f0', true: '#328a0dff' }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.action}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={22} color="#666" />
                  <Text style={styles.menuText}>{item.name}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={22} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Card */}
        <View style={styles.supportCard}>
          <View style={styles.supportIcon}>
            <Ionicons name="headset" size={24} color="#328a0dff" />
          </View>
          <View style={styles.supportContent}>
            <Text style={styles.supportTitle}>24/7 Customer Support</Text>
            <Text style={styles.supportSubtitle}>We're here to help you</Text>
          </View>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contact</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#328a0dff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>App Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editField}</Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter your ${editField}`}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPasswordModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.passwordIcon}>
              <Ionicons name="lock-closed" size={40} color="#FF6B35" />
            </View>
            <Text style={styles.modalTitle}>Forgot Password</Text>
            <Text style={styles.modalSubtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowForgotPasswordModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.modalSaveText}>Send Link</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#328a0dff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#328a0dff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  cardsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  settingsContainer: {
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
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
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  supportIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  supportSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  supportButton: {
    backgroundColor: '#328a0dff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  supportButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#328a0dff',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#328a0dff',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  passwordIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: '#328a0dff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
