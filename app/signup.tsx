import { ThemedText } from '@/components/themed-text';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = () => {
    if (phoneNumber.length >= 10 && name && email) {
      router.push('/otp-verification');
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signup with ${provider}`);
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.appTitle}>
            Prahaan's
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Create your account
          </ThemedText>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View>
            <ThemedText style={styles.label}>Full Name</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <ThemedText style={styles.label}>Mobile Number</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.signupButton,
              (!name || !email || phoneNumber.length < 10) && styles.signupButtonDisabled
            ]}
            onPress={handleSignup}
            disabled={!name || !email || phoneNumber.length < 10}
          >
            <ThemedText style={styles.signupButtonText}>Sign Up</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Social Signup */}
        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleSocialSignup('google')}
          >
            <AntDesign name="google" size={28} color="#DB4437" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleSocialSignup('apple')}
          >
            <Ionicons name="logo-apple" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <ThemedText style={styles.loginLink}>Log In</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#fff' },
  scrollViewContent: { flexGrow: 1 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: { alignItems: 'center', marginBottom: 48 },
  appTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2ECC71',
  },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666' },
  form: { gap: 14 },
  label: { fontSize: 12, fontWeight: '600', marginBottom: 8, color: '#1a1a1a' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    fontSize: 10,
    margin:5,
    backgroundColor: '#f9f9f9',
  },
  signupButton: {
    backgroundColor: '#2ECC71',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  signupButtonDisabled: { backgroundColor: '#A5D6A7' },
  signupButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 24,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  loginText: { color: '#666', fontSize: 14 },
  loginLink: { color: '#2ECC71', fontWeight: '600' },
});
