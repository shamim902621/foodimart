import BackButton from '@/components/back-button';
import React, { useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const AddAddress = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zipcode: '',
    city: '',
    country: '',
    type: '',
  });

  const fields = [
    { key: 'name', label: 'Name', value: formData.name },
    { key: 'email', label: 'Email', value: formData.email },
    { key: 'phone', label: 'Phone No.', value: formData.phone },
    { key: 'address', label: 'Address', value: formData.address },
    { key: 'zipcode', label: 'Zipcode', value: formData.zipcode },
    { key: 'city', label: 'City', value: formData.city },
    { key: 'country', label: 'India', value: formData.country },
    { key: 'type', label: 'Home', value: formData.type },
  ];

//   const updateField = (key, value) => {
//     setFormData(prev => ({ ...prev, [key]: value }));
//   };

  return (
    <View style={styles.container}>
                   
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
       <BackButton />
      <Text style={styles.header}>Add Address</Text>
      <ScrollView style={styles.scrollView}>
        {fields.map((field, index) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={field.value}
            //   onChangeText={(text) => updateField(field.key, text)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              placeholderTextColor="#999"
            />
          </View>
        ))}

        <View style={styles.separator} />

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add address</Text>
        </TouchableOpacity>
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
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  addButton: {
    backgroundColor: '#0fb207ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddAddress;