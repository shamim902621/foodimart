import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from "../../hooks/useAuth";
import { api } from '../lib/apiService'; // Ensure this points to your API helper

const PersonalDetails = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '', // Mobile acts as ID usually, so we disable editing
  });

  // 1. Fetch Data on Screen Load
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Assuming your route is mapped to GET /api/auth/profile
      const res: any = await api(`/auth/profile/get/${user?.userUUID}`);

      if (res.success && res.user) {
        setFormData({
          fullName: res.user.fullName || '',
          email: res.user.email || '',
          mobile: res.user.mobile || '',
        });
      }
    } catch (error) {
      console.log("Fetch Error", error);
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Save Data
  const handleSave = async () => {
    try {
      setSaving(true);
      // Assuming your route is mapped to PUT /api/auth/profile
      const res: any = await api('/auth/profile', 'PUT', {
        fullName: formData.fullName,
        email: formData.email
      });

      if (res.success) {
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("Error", res.message || "Update failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        title="Personal Details"
        showBack={true}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="camera" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <View style={styles.formSection}>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.disabledInputContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formData.mobile}
                editable={false}
                placeholder="Mobile Number"
              />
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.lockIcon} />
            </View>
            <Text style={styles.helperText}>Mobile number cannot be changed.</Text>
          </View>

        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },

  scrollView: {
    flex: 1,
  },

  // Avatar
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B35', // Orange Theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // Form
  formSection: {
    paddingHorizontal: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },

  // Disabled Input Styling
  disabledInputContainer: {
    position: 'relative',
    justifyContent: 'center'
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: '#888',
    paddingRight: 40
  },
  lockIcon: {
    position: 'absolute',
    right: 15,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 4,
  },

  // Footer
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default PersonalDetails;