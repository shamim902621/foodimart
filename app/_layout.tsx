
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";

const InitialLayout = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  // ✅ FIX 2: Use usePathname() to avoid TypeScript Union errors
  const pathName = usePathname();

  useEffect(() => {
    if (loading) return;

    // Define public routes (Add all routes that don't need login)
    const isPublicRoute =
      pathName === "/login" ||
      pathName === "/signup" ||
      pathName === "/otp-verification" ||
      pathName === "/welcome" ||
      pathName === "/"; // index route

    if (isAuthenticated && user) {
      // 🟢 LOGGED IN LOGIC
      // If user is logged in but on a public auth page, redirect to dashboard
      if (pathName === "/login" || pathName === "/signup" || pathName === "/welcome") {
        switch (user.role) {
          case 'SUPERADMIN':
            router.replace('/superadmin/dashboard'); // Ensure this file exists
            break;
          case 'ADMIN':
            router.replace('/admin/dashboard');
            break;
          default: // 'USER'
            router.replace('/(tabs)/home'); // Or '/category' based on your structure
        }
      }
    } else if (!isAuthenticated) {
      // 🔴 LOGGED OUT LOGIC
      // If user is NOT logged in and tries to access a private page, kick to Login
      if (!isPublicRoute) {
        router.replace('/login');
      }
    }
  }, [user, loading, isAuthenticated, pathName]);



  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* ✅ FIX 1: ROUTE NAMES MUST MATCH YOUR FILE NAMES EXACTLY 
         I updated these based on your console log list.
      */}

      {/* --- PUBLIC ROUTES --- */}
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="forgot-password" />

      {/* --- USER ROUTES --- */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="category" />

      {/* 🚨 This was the error: Changed 'product-detail' to 'product-details' */}
      <Stack.Screen name="product-details" options={{ title: "Product Details" }} />

      {/* Dynamic Product Route (from your log: index 19) */}
      <Stack.Screen name="product/[_id]" options={{ title: "Product View" }} />

      {/* Dynamic Shop Route (from your log: index 22) */}
      <Stack.Screen name="shop/[id]" options={{ title: "Shop" }} />

      <Stack.Screen name="filters" options={{ presentation: 'modal' }} />

      {/* Note: In your log, these are spelled 'shiping' (one 'p') */}
      <Stack.Screen name="shiping-method" options={{ title: "Shipping Method" }} />
      <Stack.Screen name="shiping-address" options={{ title: "Shipping Address" }} />

      <Stack.Screen name="payment-method" options={{ title: "Payment Method" }} />
      <Stack.Screen name="payment" options={{ title: "Payment" }} />
      <Stack.Screen name="order-success" />
      <Stack.Screen name="order-tracking" />

      {/* --- USER DASHBOARD ROUTES --- */}
      <Stack.Screen name="user/profile" />
      <Stack.Screen name="user/wishlist" />
      <Stack.Screen name="user/notifications" />
      <Stack.Screen name="user/help" />
      <Stack.Screen name="user/personal-details" />
      <Stack.Screen name="user/dashboard/address" />
      <Stack.Screen name="user/dashboard/checkout" />

      {/* --- ADMIN ROUTES --- */}
      <Stack.Screen name="admin" />
      <Stack.Screen name="superadmin" />

      {/* --- PRODUCT MANAGEMENT --- */}
      <Stack.Screen name="product/addproduct/add-product" />
      <Stack.Screen name="product/edit/[id]" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}