import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const UpdateAddress = () => {
  const [formData, setFormData] = useState({
    name: 'Pratham',
    email: 'pratham@gmail.com',
    phone: '9876543210',
    address: 'Regency Road, Syed Rd, Syed, Naradi.',
    zipcode: 'DSU',
    city: 'Hirazhd Pradesh',
    country: 'India',
    type: 'Home',
  });

  const fields = [
    { key: 'name', label: 'Pratham', value: formData.name },
    { key: 'email', label: 'pratham@gmail.com', value: formData.email },
    { key: 'phone', label: '9876543210', value: formData.phone },
    { key: 'address', label: 'Regency Road, Syed Rd, Syed, Naradi.', value: formData.address },
    { key: 'zipcode', label: 'DSU', value: formData.zipcode },
    { key: 'city', label: 'Hirazhd Pradesh', value: formData.city },
    { key: 'country', label: 'India', value: formData.country },
    { key: 'type', label: 'Home', value: formData.type },
  ];

//   const updateField = () => {
//     setFormData(prev => ({ ...prev, [key]: value }));
//   };

  const handleDelete = () => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.header}>Update Address</Text>
      
      <ScrollView style={styles.scrollView}>
        {fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={field.value}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Update address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 60,
    marginBottom: 30,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  updateButton: {
    flex: 2,
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdateAddress;