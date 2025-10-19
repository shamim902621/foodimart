import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

const BackButton = ({ color = '#333', size = 24 }: { color?: string; size?: number }) => {
  const router = useRouter();

 const handlePress = () => {
  try {
    router.back(); // try to go back
  } catch {
    router.push('/home'); // fallback if no previous screen exists
  }
};

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Ionicons name="arrow-back" size={size} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
  },
});
