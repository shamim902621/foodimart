import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface BackButtonProps {
  color?: string;
  size?: number;
  fallbackRoute?: string; 
}

const BackButton: React.FC<BackButtonProps> = ({
  color = '#333',
  size = 24,
  fallbackRoute = '/home', // default fallback
}) => {
  const router = useRouter();

  const handlePress = () => {
    // Try to go back, if not possible, navigate to fallbackRoute
    router.back(); 
    // Expo Router doesn't provide history check, so we immediately push fallback as a safe option
    setTimeout(() => {
      router.replace(fallbackRoute);
    }, 50); // slight delay to prevent crash if back fails
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
