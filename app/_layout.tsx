import { router, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "../hooks/useAuth";

export default function Layout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const publicRoutes = ["/login", "/signup", "/otp-verification", "/welcome"];
  const isPublic = publicRoutes.includes(pathname);


  useEffect(() => {
    // This will run once when the component mounts
    if (!loading) {
      if (user) {
        // Redirect based on user role
        switch (user.role) {
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
            router.replace('/');
        }
      }
      else if (!user) {
        router.replace('/');
      }
      else {
        router.replace('/login')
      }
    }
  }, [loading, user]);
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 🧑‍💼 USER ROUTES */}
      {user?.role === "USER" && (
        <>
          <Stack.Screen name="shop" options={{ title: "Shop" }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="filters" options={{ title: "Filters", presentation: "modal" }} />
          <Stack.Screen name="product-detail" options={{ title: "Product Details" }} />
          <Stack.Screen name="shipping-method" options={{ title: "Shipping Method" }} />
          <Stack.Screen name="shipping-address" options={{ title: "Shipping Address" }} />
          <Stack.Screen name="payment-method" options={{ title: "Payment Method" }} />
          <Stack.Screen name="order-success" options={{ headerShown: false }} />
          <Stack.Screen name="order-tracking" options={{ title: "Order Tracking" }} />
          <Stack.Screen name="user-orders" options={{ title: "My Orders" }} />
        </>
      )}

      {/* 🧑‍💻 ADMIN ROUTES */}
      {user?.role === "ADMIN" && (
        <>
          <Stack.Screen name="admin/dashboard" options={{ title: "Admin Dashboard" }} />
          <Stack.Screen name="admin/manage-users" options={{ title: "Manage Users" }} />
        </>
      )}

      {/* Common Routes */}
      <Stack.Screen name="login" options={{ title: "Sign In" }} />
      <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
      <Stack.Screen name="otp-verification" options={{ title: "Verify OTP" }} />
    </Stack>
  );
}


// import { Stack, useRouter, useSegments } from "expo-router";
// import { useEffect } from "react";
// import { ActivityIndicator, View } from "react-native";
// import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ Check this path

// // 1️⃣ This component handles Logic & Routing
// // It MUST be inside AuthProvider to use 'useAuth'
// const InitialLayout = () => {
//   const { user, loading, isAuthenticated } = useAuth();
//   const router = useRouter();
//   const segments = useSegments(); // Gets current route segments
//   useEffect(() => {
//     if (loading) return;

//     // Check if user is currently in a public authentication screen
//     const inAuthGroup = segments[0] === "login" || segments[0] === "signup" || segments[0] === "otp-verification" || segments[0] === "welcome";

//     if (isAuthenticated && user) {
//       // ✅ If user is Logged In...
//       // And they are still on Login/Signup page, move them to Dashboard
//       if (inAuthGroup) {
//         switch (user.role) {
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
//             router.replace('/category'); // Fallback
//         }
//       }
//     } else if (!isAuthenticated) {
//       // ❌ If user is Not Logged In...
//       // And they are NOT on a public page, kick them to Login
//       if (!inAuthGroup) {
//         router.replace('/login');
//       }
//     }
//   }, [user, loading, isAuthenticated, segments]);

//   // Show Loader while checking session
//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#2ECC71" />
//       </View>
//     );
//   }

//   // Define Screens
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {/* 🧑‍💼 USER ROUTES */}
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       <Stack.Screen name="category" options={{ headerShown: false }} />
//       <Stack.Screen name="shop" options={{ title: "Shop" }} />
//       <Stack.Screen name="filters" options={{ title: "Filters", presentation: "modal" }} />
//       <Stack.Screen name="product-detail" options={{ title: "Product Details" }} />
//       <Stack.Screen name="shipping-method" options={{ title: "Shipping Method" }} />
//       <Stack.Screen name="shipping-address" options={{ title: "Shipping Address" }} />
//       <Stack.Screen name="payment-method" options={{ title: "Payment Method" }} />
//       <Stack.Screen name="order-success" options={{ headerShown: false }} />
//       <Stack.Screen name="order-tracking" options={{ title: "Order Tracking" }} />
//       <Stack.Screen name="user-orders" options={{ title: "My Orders" }} />

//       {/* 🧑‍💻 ADMIN ROUTES */}
//       <Stack.Screen name="admin/dashboard" options={{ title: "Admin Dashboard" }} />
//       <Stack.Screen name="admin/manage-users" options={{ title: "Manage Users" }} />

//       {/* 🔓 PUBLIC ROUTES */}
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//       <Stack.Screen name="login" options={{ title: "Sign In" }} />
//       <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
//       <Stack.Screen name="otp-verification" options={{ title: "Verify OTP" }} />
//       <Stack.Screen name="welcome" options={{ headerShown: false }} />
//     </Stack>
//   );
// };

// // 2️⃣ This is the Main Export
// // It simply wraps InitialLayout with the Provider
// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <InitialLayout />
//     </AuthProvider>
//   );
// }