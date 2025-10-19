import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.split('').slice(0, 4);
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (i < 4) newOtp[i] = char;
      });
      setOtp(newOtp);

      // Focus last input
      const lastIndex = Math.min(pastedOtp.length - 1, 3);
      inputs.current[lastIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      console.log('Verifying OTP:', otpString);
      router.push('/(tabs)');
    }
  };

  const handleResend = () => {
    console.log('Resending OTP...');
  };

  const isOtpComplete = otp.join('').length === 4;

  return (
    <ThemedView style={styles.container} lightColor="#fff">
      <ThemedView style={styles.header} lightColor="#fff">
        <ThemedText type="title" style={styles.title}>
          OTP Verification
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter the 4-digit code sent to your mobile number
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.otpContainer} lightColor="#fff">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={value => handleOtpChange(value, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={index === 0 ? 4 : 1} // Allow paste on first input
            textContentType="oneTimeCode"
          />
        ))}
      </ThemedView>

      <TouchableOpacity
        style={[
          styles.verifyButton,
          !isOtpComplete && styles.verifyButtonDisabled
        ]}
        onPress={handleVerify}
        disabled={!isOtpComplete}
      >
        <ThemedText style={styles.verifyButtonText}>Verify OTP</ThemedText>
      </TouchableOpacity>

      <ThemedView style={styles.resendContainer} lightColor="#fff">
        <ThemedText style={styles.resendText}>
          Didn't receive the code?{' '}
        </ThemedText>
        <TouchableOpacity onPress={handleResend}>
          <ThemedText style={styles.resendLink}>Resend</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
   justifyContent:"center",
    gap:4,
    marginBottom: 40,
    backgroundColor: '#fff',
  },
  otpInput: {
    width: 45,
    height:55,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: '#fff',
    color: '#000',
  },
  verifyButton: {
     backgroundColor: '#2ECC71',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resendContainer: {
     marginTop:10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  resendText: { 
  
    color: '#666',
  },
  resendLink: {
    color: '#2ECC71',
    fontWeight: '600',
  },
});
