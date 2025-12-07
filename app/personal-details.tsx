import BackButton from '@/components/back-button';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from "../hooks/useAuth";
import { api } from "./lib/apiService"; // YOUR API helper

export default function PersonalDetails() {

  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // -------------------------------
  // 🔵 GET PROFILE (ON SCREEN LOAD)
  // -------------------------------
  const fetchProfile = async () => {
    try {
      const res = await api("/profile", "GET", undefined, token ?? "");

      setFormData({
        firstName: res.user.firstName || "",
        lastName: res.user.lastName || "",
        email: res.user.email || "",
        mobile: res.user.mobile || "",
        dob: res.user.dob ? res.user.dob.split("T")[0] : "",
        gender: res.user.gender || "",
      });

    } catch (error: any) {
      console.log("GET profile error:", error);
      Alert.alert("Error", error.message || "Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // -------------------------------
  // 🔵 UPDATE FIELD LOCALLY
  // -------------------------------
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // -------------------------------
  // 🔥 SAVE CHANGES → PUT /profile
  // -------------------------------
  const handleSave = async () => {
    try {
      const body = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        dob: formData.dob,
        gender: formData.gender,
      };

      const res = await api("/profile", "PUT", body, token ?? "");

      Alert.alert("Success", "Personal details updated!");
      setIsEditing(false);

      fetchProfile(); // refresh UI

    } catch (error: any) {
      console.log("UPDATE profile error:", error);
      Alert.alert("Error", error.message || "Update failed");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Personal Details</Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Cancel" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* FORM */}
        <View style={styles.formSection}>

          <View style={styles.fieldRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.firstName}
                onChangeText={(text) => updateField("firstName", text)}
                editable={isEditing}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.lastName}
                onChangeText={(text) => updateField("lastName", text)}
                editable={isEditing}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
              editable={isEditing}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput]}
              value={formData.mobile}
              onChangeText={(text) => updateField("mobile", text)}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.dob}
                onChangeText={(text) => updateField("dob", text)}
                editable={isEditing}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={formData.gender}
                onChangeText={(text) => updateField("gender", text)}
                editable={isEditing}
              />
            </View>
          </View>

        </View>

        {/* Save Button */}
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

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
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  photoSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoText: {
    fontSize: 14,
    color: '#666',
  },
  formSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  fieldContainer: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f8f8f8',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 20,
    marginBottom: 20,
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
  optionsSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
});