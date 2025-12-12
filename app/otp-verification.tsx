import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../constants/constant';

export default function OTPVerificationScreen() {
  const { mobile } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showotp, setShowotp] = useState(null)
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const { login } = useAuth();
  const router = useRouter();
  // Add the missing handleOtpChange function
  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle OTP paste
      const pastedOtp = value.split('').slice(0, 6);
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputs.current[Math.min(pastedOtp.length - 1, 5)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Add the missing handleKeyPress function
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: otpString }),
      });

      const result = await response.json();
      console.log('OTP Verification Response:', result.user, result.user.role);

      if (result.success) {
        await login(result.token, result.user); // save state first

        Alert.alert('Success', result.message || 'Login successful!');
        setTimeout(() => {
          // router.replace('/category');
        }, 500);
        // Then navigate
        switch (result?.user.role) {
          case 'USER':
            router.replace('/category');
            break;

          case 'ADMIN':
            router.replace('/admin/dashboard');
            break;

          case 'SUPERADMIN':
            router.replace('/superadmin/dashboard');
            break;

          default:
            router.replace('/category');
        }
      }




    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // --- AUTO REFRESH FUNCTION ---



  const handleResend = async () => {
    if (!mobile || mobile.length < 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: mobile }),
      });

      const data = await response.json();
      setLoading(false);
      if (data.otp) {
        setShowotp(data.otp);
      } else {
        setShowotp(null); // handle case where OTP might not be in response
      }

    } catch (error) {
      setLoading(false);
      Alert.alert("Network Error", "Unable to reach the server. Please try again later.");
      console.error("Error sending OTP:", error);
    }
  };
  console.log("show otp", showotp);

  const isOtpComplete = otp.join('').length === 6;

  return (
    <ThemedView style={styles.container} lightColor="#fff">
      <View style={styles.header} >
        <ThemedText type="title" style={styles.title}>
          OTP Verification "{showotp}"
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter the 6-digit code sent to {mobile}
        </ThemedText>
      </View>

      <View style={styles.otpContainer} >
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref: any) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={index === 0 ? 6 : 1}
            textContentType="oneTimeCode"
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, !isOtpComplete && styles.verifyButtonDisabled]}
        onPress={handleVerify}
        disabled={!isOtpComplete || loading}
      >
        <ThemedText style={styles.verifyButtonText}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.resendContainer} >
        <ThemedText style={styles.resendText}>Didn't receive the code? </ThemedText>
        <TouchableOpacity onPress={handleResend}>
          <ThemedText style={styles.resendLink}>Resend</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  header: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#666', lineHeight: 22 },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 40 },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#fff',
    color: '#000',
  },
  verifyButton: { backgroundColor: '#2ECC71', padding: 14, borderRadius: 10, alignItems: 'center' },
  verifyButtonDisabled: { backgroundColor: '#A5D6A7' },
  verifyButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resendContainer: { marginTop: 16, flexDirection: 'row', justifyContent: 'center' },
  resendText: { color: '#666' },
  resendLink: { color: '#2ECC71', fontWeight: 'bold' },
});