import BackButton from "@/components/back-button";
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location'; // ✅ Import Location
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../lib/apiService";

// --- TYPES ---
type Address = {
  id: string; // or _id depending on DB
  type: 'Home' | 'Work' | 'Other';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  isDefault?: boolean;
};

const emptyForm = {
  type: "Home", // Default to Home
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  zipCode: "",
  landmark: "",
  isDefault: false,
};

export default function AddAddress() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const isEdit = !!editingId;

  // 🔹 Load all addresses
  const loadAddresses = async () => {
    try {
      setLoading(true);
      // Corrected Route based on your backend 'list.js'
      const res: any = await api(`/users/address/get/${user?.userUUID}`);
      setAddresses(res.addresses || []);
    } catch (e) {
      console.log("Failed to load addresses", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // 🔹 Handle Field Change
  const updateField = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // 🔹 Use Current Location Logic
  const handleUseCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to auto-fill address.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (geocode.length > 0) {
        const addr = geocode[0];
        setFormData(prev => ({
          ...prev,
          city: addr.city || addr.subregion || '',
          state: addr.region || '',
          zipCode: addr.postalCode || '',
          addressLine1: `${addr.streetNumber || ''} ${addr.street || ''} ${addr.name || ''}`.trim(),
          addressLine2: addr.district || ''
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch location");
    } finally {
      setLocationLoading(false);
    }
  };

  // 🔹 Prepare Edit
  const handleEdit = (addr: any) => {
    setEditingId(addr.id || addr._id); // Handle both SQL(id) and Mongo(_id)
    setFormData({
      type: addr.type,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      landmark: addr.landmark || "",
      isDefault: addr.isDefault
    });
  };

  // 🔹 Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  // 🔹 Submit Form
  const submit = async () => {
    // Validation
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.zipCode) {
      Alert.alert("Missing Fields", "Address, City, State, and Zip Code are required.");
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        // Corrected Route based on your backend 'update.js'
        await api(`/users/address/update/${editingId}`, "PUT", formData);
        Alert.alert("Success", "Address updated successfully");
      } else {
        // Corrected Route based on your backend 'create.js'
        await api(`/users/address/add/${user?.userUUID}`, "POST", formData);
        Alert.alert("Success", "New address added successfully");
      }

      setEditingId(null);
      setFormData(emptyForm);
      loadAddresses(); // Refresh list
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.headerRow}>
        <BackButton />
        <Text style={styles.headerTitle}>My Addresses</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* 🔹 SAVED ADDRESSES LIST */}
        {addresses.length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            {addresses.map((addr) => (
              <View key={addr.id || (addr as any)._id} style={[styles.addressCard, editingId === (addr.id || (addr as any)._id) && styles.activeCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.typeTag}>
                    <Ionicons
                      name={addr.type === 'Home' ? 'home' : addr.type === 'Work' ? 'briefcase' : 'location'}
                      size={12} color="#555"
                    />
                    <Text style={styles.typeText}>{addr.type}</Text>
                  </View>
                  {addr.isDefault && <Text style={styles.defaultText}>Default</Text>}
                </View>

                <Text style={styles.addressText}>
                  {addr.addressLine1}, {addr.city}, {addr.state} - {addr.zipCode}
                </Text>

                <TouchableOpacity onPress={() => handleEdit(addr)}>
                  <Text style={styles.editLink}>EDIT</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.separator} />

        {/* 🔹 ADD / EDIT FORM SECTION */}
        <View style={styles.formSection}>
          <Text style={styles.formHeader}>
            {isEdit ? "Update Address" : "Add New Address"}
          </Text>

          {/* Use Current Location Button */}
          <TouchableOpacity style={styles.gpsButton} onPress={handleUseCurrentLocation}>
            {locationLoading ? <ActivityIndicator color="#FF6B35" /> : <Ionicons name="locate" size={18} color="#FF6B35" />}
            <Text style={styles.gpsText}>Use Current Location</Text>
          </TouchableOpacity>

          {/* Type Selector */}
          <View style={styles.typeRow}>
            {['Home', 'Work', 'Other'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, formData.type === t && styles.activeChip]}
                onPress={() => updateField('type', t)}
              >
                <Text style={[styles.chipText, formData.type === t && styles.activeChipText]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>House No / Building Name *</Text>
            <TextInput
              value={formData.addressLine1}
              onChangeText={(t) => updateField('addressLine1', t)}
              style={styles.input}
              placeholder="e.g. Flat 101, Galaxy Apts"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area / Road Name</Text>
            <TextInput
              value={formData.addressLine2}
              onChangeText={(t) => updateField('addressLine2', t)}
              style={styles.input}
              placeholder="e.g. MG Road, Near Park"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                value={formData.city}
                onChangeText={(t) => updateField('city', t)}
                style={styles.input}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                value={formData.state}
                onChangeText={(t) => updateField('state', t)}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Pincode *</Text>
              <TextInput
                value={formData.zipCode}
                onChangeText={(t) => updateField('zipCode', t)}
                style={styles.input}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Landmark</Text>
              <TextInput
                value={formData.landmark}
                onChangeText={(t) => updateField('landmark', t)}
                style={styles.input}
              />
            </View>
          </View>

          {/* Actions */}
          <TouchableOpacity style={styles.saveButton} onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : (
              <Text style={styles.saveButtonText}>{isEdit ? "Update Address" : "Save Address"}</Text>
            )}
          </TouchableOpacity>

          {isEdit && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelText}>Cancel Edit</Text>
            </TouchableOpacity>
          )}

        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  // Header
  headerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },

  // List
  listSection: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 15, color: '#333' },
  addressCard: {
    backgroundColor: "#F9F9F9", padding: 16, borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#EEE'
  },
  activeCard: { borderColor: '#FF6B35', backgroundColor: '#FFF5F0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#EAEAEA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4
  },
  typeText: { fontSize: 12, fontWeight: '700', color: '#555' },
  defaultText: { fontSize: 12, fontWeight: '700', color: '#2E7D32' },
  addressText: { color: "#555", fontSize: 14, lineHeight: 20, marginBottom: 10 },
  editLink: { color: "#FF6B35", fontWeight: '700', fontSize: 12 },

  separator: { height: 8, backgroundColor: '#F0F0F0' },

  // Form
  formSection: { padding: 20 },
  formHeader: { fontSize: 18, fontWeight: "700", marginBottom: 20 },

  // GPS Button
  gpsButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: '#FF6B35', padding: 12, borderRadius: 8, marginBottom: 20
  },
  gpsText: { color: '#FF6B35', fontWeight: '600' },

  // Type Chips
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0' },
  activeChip: { backgroundColor: '#FF6B35' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  activeChipText: { color: '#FFF' },

  // Inputs
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12,
    fontSize: 15, backgroundColor: '#FFF', color: '#333'
  },
  row: { flexDirection: 'row', gap: 12 },

  // Buttons
  saveButton: {
    backgroundColor: '#FF6B35', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { padding: 16, alignItems: 'center' },
  cancelText: { color: '#666' }
});