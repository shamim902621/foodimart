// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { useAuth } from '@/hooks/useAuth';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { useRef, useState } from 'react';
// import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
// import { API_BASE_URL } from '../constants/constant';

// export default function OTPVerificationScreen() {
//   const { mobile } = useLocalSearchParams();
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [showotp, setShowotp] = useState(null)
//   const [loading, setLoading] = useState(false);
//   const inputs = useRef<Array<TextInput | null>>([]);
//   const { login } = useAuth();
//   const router = useRouter();
//   // Add the missing handleOtpChange function
//   const handleOtpChange = (value: string, index: number) => {
//     if (value.length > 1) {
//       // Handle OTP paste
//       const pastedOtp = value.split('').slice(0, 6);
//       const newOtp = [...otp];
//       pastedOtp.forEach((char, i) => {
//         if (i < 6) newOtp[i] = char;
//       });
//       setOtp(newOtp);
//       inputs.current[Math.min(pastedOtp.length - 1, 5)]?.focus();
//       return;
//     }

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 5) {
//       inputs.current[index + 1]?.focus();
//     }
//   };

//   // Add the missing handleKeyPress function
//   const handleKeyPress = (e: any, index: number) => {
//     if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
//       inputs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerify = async () => {
//     const otpString = otp.join('');
//     if (otpString.length !== 6) {
//       Alert.alert('Error', 'Please enter complete OTP');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ mobile, otp: otpString }),
//       });

//       const result = await response.json();
//       console.log('OTP Verification Response:', result.user, result.user.role);

//       if (result.success) {
//         await login(result.token, result.user); // save state first

//         Alert.alert('Success', result.message || 'Login successful!');
//         setTimeout(() => {
//           // router.replace('/category');
//         }, 500);
//         // Then navigate
//         switch (result?.user.role) {
//           case 'USER':
//             router.replace('/category');
//             break;

//           case 'ADMIN':
//             router.replace('/admin/dashboard');
//             break;

//           case 'SUPERADMIN':
//             router.replace('/superadmin/dashboard');
//             break;

//           default:
//             router.replace('/category');
//         }
//       }




//     } catch (error) {
//       console.error('OTP Verification Error:', error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
//   // --- AUTO REFRESH FUNCTION ---



//   const handleResend = async () => {
//     if (!mobile || mobile.length < 10) {
//       Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ mobile: mobile }),
//       });

//       const data = await response.json();
//       setLoading(false);
//       if (data.otp) {
//         setShowotp(data.otp);
//       } else {
//         setShowotp(null); // handle case where OTP might not be in response
//       }

//     } catch (error) {
//       setLoading(false);
//       Alert.alert("Network Error", "Unable to reach the server. Please try again later.");
//       console.error("Error sending OTP:", error);
//     }
//   };

//   const isOtpComplete = otp.join('').length === 6;

//   return (
//     <ThemedView style={styles.container} lightColor="#fff">
//       <View style={styles.header} >
//         <ThemedText type="title" style={styles.title}>
//           OTP Verification "{showotp}"
//         </ThemedText>
//         <ThemedText style={styles.subtitle}>
//           Enter the 6-digit code sent to {mobile}
//         </ThemedText>
//       </View>

//       <View style={styles.otpContainer} >
//         {otp.map((digit, index) => (
//           <TextInput
//             key={index}
//             ref={(ref: any) => (inputs.current[index] = ref)}
//             style={styles.otpInput}
//             value={digit}
//             onChangeText={value => handleOtpChange(value, index)}
//             onKeyPress={e => handleKeyPress(e, index)}
//             keyboardType="number-pad"
//             maxLength={index === 0 ? 6 : 1}
//             textContentType="oneTimeCode"
//           />
//         ))}
//       </View>

//       <TouchableOpacity
//         style={[styles.verifyButton, !isOtpComplete && styles.verifyButtonDisabled]}
//         onPress={handleVerify}
//         disabled={!isOtpComplete || loading}
//       >
//         <ThemedText style={styles.verifyButtonText}>
//           {loading ? 'Verifying...' : 'Verify OTP'}
//         </ThemedText>
//       </TouchableOpacity>

//       <View style={styles.resendContainer} >
//         <ThemedText style={styles.resendText}>Didn't receive the code? </ThemedText>
//         <TouchableOpacity onPress={handleResend}>
//           <ThemedText style={styles.resendLink}>Resend</ThemedText>
//         </TouchableOpacity>
//       </View>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
//   header: { alignItems: 'center', marginBottom: 48 },
//   title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#1a1a1a', textAlign: 'center' },
//   subtitle: { fontSize: 16, textAlign: 'center', color: '#666', lineHeight: 22 },
//   otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 40 },
//   otpInput: {
//     width: 50,
//     height: 60,
//     borderWidth: 2,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: '600',
//     backgroundColor: '#fff',
//     color: '#000',
//   },
//   verifyButton: { backgroundColor: '#2ECC71', padding: 14, borderRadius: 10, alignItems: 'center' },
//   verifyButtonDisabled: { backgroundColor: '#A5D6A7' },
//   verifyButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
//   resendContainer: { marginTop: 16, flexDirection: 'row', justifyContent: 'center' },
//   resendText: { color: '#666' },
//   resendLink: { color: '#2ECC71', fontWeight: 'bold' },
// });


import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_BASE_URL } from '../constants/constant';

export default function OTPVerificationScreen() {
  // 1. Capture all possible params (Login params vs Signup params)
  const params = useLocalSearchParams();
  const { mobile, firstName, lastName, email, password, role } = params;

  // Detect if this is a Signup flow (if extra data exists)
  const isSignup = !!(firstName && email && password);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30); // Resend timer
  const inputs = useRef<Array<TextInput | null>>([]);

  const { login } = useAuth();
  const router = useRouter();

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: NodeJS.Timeout | number;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // --- INPUT HANDLERS ---
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];

    // Handle Paste (e.g., user pastes "123456")
    if (value.length > 1) {
      const pastedOtp = value.slice(0, 6).split('');
      pastedOtp.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Focus the last filled input
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      inputs.current[nextIndex]?.focus();
      return;
    }

    // Handle Single Character Input
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus Next
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    // Auto-Submit if filled
    if (newOtp.join('').length === 6) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // --- VERIFY ACTION ---
  const phandleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      let url = `${API_BASE_URL}/auth/verify-otp`;
      let payload: any = { mobile, otp: otpString };

      // 🚀 EDGE CASE: If Signup, switch endpoint & add user data
      if (isSignup) {
        url = `${API_BASE_URL}/auth/register`; // Or whatever your signup endpoint is
        payload = {
          mobile,
          otp: otpString,
          firstName,
          lastName,
          email,
          password,
          role: role || 'USER' // Default to USER if missing
        };
      }

      console.log(`Verifying OTP for ${isSignup ? 'Signup' : 'Login'}...`);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Auth Response:', result);

      if (response.ok && result.success) {
        // ✅ Login Success: Save Token
        await login(result.token, result.user);

        Alert.alert('Success', isSignup ? 'Account created successfully!' : 'Welcome back!');

        // 🔀 Role-Based Redirect
        setTimeout(() => {
          const userRole = result.user?.role || role;
          if (userRole === 'SUPERADMIN') router.replace('/superadmin/dashboard');
          else if (userRole === 'ADMIN') router.replace('/admin/dashboard');
          else router.replace('/category'); // Standard User Home
        }, 500);

      } else {
        Alert.alert('Verification Failed', result.message || 'Invalid OTP code.');
        setOtp(['', '', '', '', '', '']); // Reset OTP on failure
        inputs.current[0]?.focus();
      }

    } catch (error) {
      console.error('Verify Error:', error);
      Alert.alert('Error', 'Server unreachable. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };
  // ✅ THIS IS THE MAIN FIX
  // ✅ REPLACE YOUR EXISTING handleVerify WITH THIS CODE
  const handleVerify = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      let url = `${API_BASE_URL}/auth/verify-otp`;
      let payload: any = { mobile, otp: otpString };

      // Signup logic
      if (isSignup) {
        url = `${API_BASE_URL}/auth/register`;
        payload = {
          mobile,
          otp: otpString,
          firstName,
          lastName,
          email,
          password,
          role: role || 'USER',
        };
      }

      console.log(`Sending request to: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Auth Response:', result);

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Invalid OTP');
      }

      // 1️⃣ Update Global Auth State
      // Isko await karna zaroori hai
      await login(result.token, result.user);

      // 2️⃣ Get the Role from API response
      const userRole = result.user?.role || 'USER';
      console.log("✅ Login Success. Role:", userRole);

      // 3️⃣ 🔥 FIX: Wait 500ms before redirecting
      // Reason: _layout.tsx needs time to realize "user" is not null anymore.
      setTimeout(() => {
        if (userRole === 'SUPERADMIN') {
          router.replace('/superadmin/dashboard');
        } else if (userRole === 'ADMIN') {
          router.replace('/admin/dashboard');
        } else {
          // Make sure this route matches your folder structure!
          // Use '/(tabs)/home' or '/category' based on what you have in app/ folder
          router.replace('/category');
        }
      }, 1000);

    } catch (error: any) {
      console.error('Verify Error:', error);
      Alert.alert('Verification Failed', error.message);
      setOtp(['', '', '', '', '', '']); // Reset OTP
      inputs.current[0]?.focus(); // Focus first input
      setLoading(false);
    }
  };
  // --- RESEND ACTION ---
  const handleResend = async () => {
    if (timer > 0) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('OTP Resent', `A new code has been sent to ${mobile}`);
        setTimer(30); // Reset timer
      } else {
        Alert.alert('Error', data.message || 'Could not resend OTP.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network request failed.');
    } finally {
      setLoading(false);
    }
  };

  const isOtpComplete = otp.join('').length === 6;

  return (
    <ThemedView style={styles.container} lightColor="#fff">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Verification Code

            [Image of Locked Padlock]

          </ThemedText>
          <ThemedText style={styles.subtitle}>
            We have sent the verification code to {'\n'}
            <ThemedText style={{ fontWeight: '700', color: '#000' }}>{mobile || "your number"}</ThemedText>
          </ThemedText>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputs.current[index] = ref;
              }}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={6} // Allows pasting 6 digits in the first box
              selectTextOnFocus
              cursorColor="#2ECC71"
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, (!isOtpComplete || loading) && styles.verifyButtonDisabled]}
          onPress={handleVerify}
          disabled={!isOtpComplete || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.verifyButtonText}>Verify & Proceed</ThemedText>
          )}
        </TouchableOpacity>

        {/* Resend Link */}
        <View style={styles.resendContainer}>
          <ThemedText style={styles.resendText}>
            Didn't receive code?{' '}
          </ThemedText>
          <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
            <ThemedText style={[styles.resendLink, timer > 0 && { color: '#999' }]}>
              {timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}
            </ThemedText>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 10, color: '#1a1a1a', textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', color: '#666', lineHeight: 22 },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    backgroundColor: '#F9FAFB',
    color: '#374151',
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  otpInputFilled: {
    borderColor: '#2ECC71',
    backgroundColor: '#F0FDF4',
    color: '#15803D'
  },

  verifyButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#2ECC71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  verifyButtonDisabled: { backgroundColor: '#A5D6A7', shadowOpacity: 0, elevation: 0 },
  verifyButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  resendContainer: { marginTop: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  resendText: { color: '#6B7280', fontSize: 14 },
  resendLink: { color: '#2ECC71', fontWeight: '700', fontSize: 14 },
});