import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSendLink = () => {
    if (!email) {
      setError('Error! Address');
      return;
    }
    setError('');
    // Handle send link logic
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Forgot Password</Text>
        
        <Text style={styles.description}>
          No worries -- we'll help you reset it and get back into your account in no time.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleSendLink}>
          <Text style={styles.sendButtonText}>Send link</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Custom Keyboard */}
        <View style={styles.keyboard}>
          {keyboardRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map((key, keyIndex) => (
                <TouchableOpacity key={keyIndex} style={styles.keyButton}>
                  <Text style={styles.keyText}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          <View style={styles.keyboardRow}>
            <TouchableOpacity style={styles.specialKey}>
              <Text style={styles.keyText}>123</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialKey}>
              <Text style={styles.keyText}>$0pCp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.specialKey}>
              <Text style={styles.keyText}>RWMT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 80,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
  },
  sendButton: {
    backgroundColor: '#6C63FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  keyboard: {
    marginTop: 20,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  keyButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    margin: 2,
    borderRadius: 6,
    minWidth: 35,
    alignItems: 'center',
  },
  specialKey: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    margin: 2,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  keyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default ForgotPassword;