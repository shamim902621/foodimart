// import AppHeader from '@/components/AppHeader'; // ✅ Ensure correct path (capital A usually)
// import { ThemedText } from '@/components/themed-text';
// import { AntDesign, Ionicons } from '@expo/vector-icons';
// import { Link, router } from 'expo-router';
// import { useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { API_BASE_URL } from '../constants/constant';

// export default function SignupScreen() {
//   // --- STATE ---
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // --- HANDLER ---
//   const handleSignup = async () => {
//     // 1. Validation
//     if (!firstName || !lastName || !email || !password || mobile.length < 10) {
//       Alert.alert('Missing Fields', 'Please fill all required fields.');
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Invalid Email', 'Please enter a valid email address.');
//       return;
//     }

//     setLoading(true);

//     try {
//       // 2. API Call to Send OTP
//       const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ mobile }),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         // 3. Navigate to OTP Screen with Data
//         router.push({
//           pathname: '/otp-verification',
//           params: {
//             firstName,
//             lastName,
//             email,
//             mobile,
//             password,
//             role,
//           }
//         });
//       } else {
//         Alert.alert('Error', data.message || 'Failed to send OTP.');
//       }
//     } catch (error) {
//       console.error('Signup Network Error:', error);
//       Alert.alert('Network Error', 'Check your internet connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSocialSignup = (provider: string) => {
//     Alert.alert("Coming Soon", `${provider} login is under development.`);
//   };

//   return (
//     <View style={styles.mainContainer}>
//       {/* Header outside ScrollView so it stays fixed */}
//       <AppHeader title='Signup' showBack={true} />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollViewContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <View style={styles.container}>

//             {/* Title Section */}
//             <View style={styles.headerSection}>
//               <ThemedText style={styles.headerSubtitle}>
//                 Create your account to get started
//               </ThemedText>
//             </View>

//             {/* Role Selection */}
//             <View style={styles.roleContainer}>
//               <TouchableOpacity
//                 style={[styles.roleButton, role === 'USER' && styles.roleButtonActive]}
//                 onPress={() => setRole('USER')}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons name="person-outline" size={18} color={role === 'USER' ? '#fff' : '#666'} />
//                 <ThemedText style={[styles.roleText, role === 'USER' && styles.roleTextActive]}>
//                   Customer
//                 </ThemedText>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[styles.roleButton, role === 'ADMIN' && styles.roleButtonActive]}
//                 onPress={() => setRole('ADMIN')}
//                 activeOpacity={0.8}
//               >
//                 <Ionicons name="storefront-outline" size={18} color={role === 'ADMIN' ? '#fff' : '#666'} />
//                 <ThemedText style={[styles.roleText, role === 'ADMIN' && styles.roleTextActive]}>
//                   Seller / Shop
//                 </ThemedText>
//               </TouchableOpacity>
//             </View>

//             {/* Inputs Section */}
//             <View style={styles.form}>

//               {/* Name Row */}
//               <View style={styles.row}>
//                 <View style={styles.flex1}>
//                   <ThemedText style={styles.label}>First Name</ThemedText>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="John"
//                     value={firstName}
//                     onChangeText={setFirstName}
//                     placeholderTextColor="#999"
//                   />
//                 </View>
//                 <View style={styles.flex1}>
//                   <ThemedText style={styles.label}>Last Name</ThemedText>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Doe"
//                     value={lastName}
//                     onChangeText={setLastName}
//                     placeholderTextColor="#999"
//                   />
//                 </View>
//               </View>

//               {/* Email */}
//               <View>
//                 <ThemedText style={styles.label}>Email Address</ThemedText>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="john@example.com"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   value={email}
//                   onChangeText={setEmail}
//                   placeholderTextColor="#999"
//                 />
//               </View>

//               {/* Mobile */}
//               <View>
//                 <ThemedText style={styles.label}>Mobile Number</ThemedText>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="9876543210"
//                   keyboardType="phone-pad"
//                   value={mobile}
//                   onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
//                   maxLength={10}
//                   placeholderTextColor="#999"
//                 />
//               </View>

//               {/* Password */}
//               <View>
//                 <ThemedText style={styles.label}>Password</ThemedText>
//                 <View style={styles.passwordContainer}>
//                   <TextInput
//                     style={styles.passwordInput}
//                     placeholder="Create a strong password"
//                     secureTextEntry={!showPassword}
//                     value={password}
//                     onChangeText={setPassword}
//                     placeholderTextColor="#999"
//                   />
//                   <TouchableOpacity
//                     onPress={() => setShowPassword(!showPassword)}
//                     style={styles.eyeIcon}
//                     hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//                   >
//                     <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Action Button */}
//               <TouchableOpacity
//                 style={[
//                   styles.signupButton,
//                   (loading || !firstName || !mobile) && styles.signupButtonDisabled
//                 ]}
//                 onPress={handleSignup}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <ThemedText style={styles.signupButtonText}>Sign Up & Verify OTP</ThemedText>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Social & Login */}
//             <View style={styles.footerSection}>
//               <View style={styles.divider}>
//                 <View style={styles.dividerLine} />
//                 <ThemedText style={styles.dividerText}>OR</ThemedText>
//                 <View style={styles.dividerLine} />
//               </View>

//               <View style={styles.socialButtons}>
//                 <TouchableOpacity style={styles.iconButton} onPress={() => handleSocialSignup('google')}>
//                   <AntDesign name="google" size={24} color="#DB4437" />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.iconButton} onPress={() => handleSocialSignup('apple')}>
//                   <Ionicons name="logo-apple" size={24} color="#000" />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.loginContainer}>
//                 <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
//                 <Link href="/login" asChild>
//                   <TouchableOpacity>
//                     <ThemedText style={styles.loginLink}>Log In</ThemedText>
//                   </TouchableOpacity>
//                 </Link>
//               </View>
//             </View>

//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: { flex: 1, backgroundColor: '#fff' },
//   scrollView: { flex: 1 },
//   scrollViewContent: { flexGrow: 1, paddingBottom: 40 }, // Added padding bottom for scroll space

//   container: {
//     padding: 24,
//     maxWidth: 500,
//     alignSelf: 'center',
//     width: '100%',
//   },

//   headerSection: { alignItems: 'center', marginBottom: 24 },
//   headerSubtitle: { fontSize: 16, textAlign: 'center', color: '#666' },

//   // Role Selector
//   roleContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#F3F4F6',
//     borderRadius: 12,
//     padding: 4,
//     marginBottom: 24,
//   },
//   roleButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 10,
//     gap: 8,
//   },
//   roleButtonActive: {
//     backgroundColor: '#2ECC71',
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   roleText: { fontSize: 14, fontWeight: '600', color: '#666' },
//   roleTextActive: { color: '#fff' },

//   // Forms
//   form: { gap: 16 },
//   row: { flexDirection: 'row', gap: 12 },
//   flex1: { flex: 1 },

//   label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#374151' },
//   input: {
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 16,
//     backgroundColor: '#FAFAFA',
//     color: '#111',
//   },

//   passwordContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     borderRadius: 10,
//     backgroundColor: '#FAFAFA',
//   },
//   passwordInput: {
//     flex: 1,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#111',
//   },
//   eyeIcon: { padding: 12 },

//   signupButton: {
//     backgroundColor: '#2ECC71',
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 12,
//     shadowColor: "#2ECC71",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   signupButtonDisabled: { backgroundColor: '#A5D6A7', shadowOpacity: 0 },
//   signupButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

//   // Footer
//   footerSection: { marginTop: 32 },

//   divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
//   dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
//   dividerText: { marginHorizontal: 12, color: '#999', fontSize: 12 },

//   socialButtons: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 20,
//     marginBottom: 24,
//   },
//   iconButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 1,
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   loginText: { color: '#666', fontSize: 14 },
//   loginLink: { color: '#2ECC71', fontWeight: '700' },
// });



import AppHeader from '@/components/AppHeader';
import { ThemedText } from '@/components/themed-text';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_BASE_URL } from '../constants/constant';

export default function SignupScreen() {
  // --- STATE ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // ✅ Terms Checkbox State
  const [loading, setLoading] = useState(false);

  // --- HANDLER ---
  const handleSignup = async () => {
    Keyboard.dismiss();

    // 1. Validation
    if (!firstName || !lastName || !email || !password || !mobile) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Invalid Mobile', 'Mobile number must be exactly 10 digits.');
      return;
    }

    if (!isChecked) {
      Alert.alert('Terms Required', 'Please accept the Terms & Privacy Policy to continue.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      console.log("Sending OTP to:", mobile);

      // 2. API Call to Send OTP
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 3. Navigate to OTP Screen with ALL Data
        // The OTP screen will handle the final "Register & Redirect to Category" logic
        router.push({
          pathname: '/otp-verification',
          params: {
            firstName,
            lastName,
            email,
            mobile,
            password,
            role,
          }
        });
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Signup Network Error:', error);
      Alert.alert('Network Error', 'Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    Alert.alert("Coming Soon", `${provider} login is under development.`);
  };

  return (
    <View style={styles.mainContainer}>
      <AppHeader title='Create Account' showBack={true} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            {/* Header Text */}
            <View style={styles.headerSection}>
              <ThemedText style={styles.headerSubtitle}>
                Fill your details to get started
              </ThemedText>
            </View>

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'USER' && styles.roleButtonActive]}
                onPress={() => setRole('USER')}
                activeOpacity={0.8}
              >
                <Ionicons name="person-outline" size={18} color={role === 'USER' ? '#fff' : '#666'} />
                <ThemedText style={[styles.roleText, role === 'USER' && styles.roleTextActive]}>
                  Customer
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, role === 'ADMIN' && styles.roleButtonActive]}
                onPress={() => setRole('ADMIN')}
                activeOpacity={0.8}
              >
                <Ionicons name="storefront-outline" size={18} color={role === 'ADMIN' ? '#fff' : '#666'} />
                <ThemedText style={[styles.roleText, role === 'ADMIN' && styles.roleTextActive]}>
                  Seller / Shop
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Forms */}
            <View style={styles.form}>

              {/* Names */}
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <ThemedText style={styles.label}>First Name</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.flex1}>
                  <ThemedText style={styles.label}>Last Name</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholderTextColor="#999"
                  />
                </View>
              </View>

              {/* Email */}
              <View>
                <ThemedText style={styles.label}>Email Address</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Mobile */}
              <View>
                <ThemedText style={styles.label}>Mobile Number</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="9876543210"
                  keyboardType="number-pad"
                  value={mobile}
                  onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
                  maxLength={10}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Password */}
              <View>
                <ThemedText style={styles.label}>Password</ThemedText>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Create password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#999"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ✅ Terms Checkbox (The "Check Box" you requested) */}
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setIsChecked(!isChecked)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                  {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.checkboxText}>
                  I agree to the <Text style={styles.linkText}>Terms</Text> & <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Signup Button */}
              <TouchableOpacity
                style={[
                  styles.signupButton,
                  (loading || !firstName || !mobile || !isChecked) && styles.signupButtonDisabled
                ]}
                onPress={handleSignup}
                disabled={loading || !isChecked}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.signupButtonText}>Sign Up & Verify OTP</ThemedText>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footerSection}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>OR</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity style={styles.iconButton} onPress={() => handleSocialSignup('google')}>
                  <AntDesign name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={() => handleSocialSignup('apple')}>
                  <Ionicons name="logo-apple" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.loginContainer}>
                <ThemedText style={styles.loginText}>Already have an account? </ThemedText>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <ThemedText style={styles.loginLink}>Log In</ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  scrollViewContent: { flexGrow: 1, paddingBottom: 40 },

  container: {
    padding: 24,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },

  headerSection: { alignItems: 'center', marginBottom: 24 },
  headerSubtitle: { fontSize: 16, textAlign: 'center', color: '#666' },

  // Role Selector
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: '#2ECC71',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  roleText: { fontSize: 14, fontWeight: '600', color: '#666' },
  roleTextActive: { color: '#fff' },

  // Forms
  form: { gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  flex1: { flex: 1 },

  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#374151' },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#111',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FAFAFA',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111',
  },
  eyeIcon: { padding: 12 },

  // Checkbox Styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#2ECC71',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2ECC71',
  },
  checkboxText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  linkText: {
    color: '#2ECC71',
    fontWeight: '700',
  },

  // Signup Button
  signupButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#2ECC71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  signupButtonDisabled: { backgroundColor: '#A5D6A7', shadowOpacity: 0 },
  signupButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Footer
  footerSection: { marginTop: 32 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, color: '#999', fontSize: 12 },

  socialButtons: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 24 },
  iconButton: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', elevation: 1
  },
  loginContainer: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#666', fontSize: 14 },
  loginLink: { color: '#2ECC71', fontWeight: '700' },
});