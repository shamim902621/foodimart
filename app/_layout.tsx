
import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";

const InitialLayout = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // ⏳ Wait till auth is restored
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  // Public routes
  const publicRoutes = [
    "/",
    "/welcome",
    "/login",
    "/signup",
    "/otp-verification",
    "/forgot-password",
  ];

  const isPublicRoute = publicRoutes.includes(pathname);

  // 🔴 Not logged in → protect private routes
  if (!user && !isPublicRoute) {
    return <Redirect href="/login" />;
  }

  // 🟢 Logged in → redirect based on role (ONLY once)
  if (user && isPublicRoute) {
    if (user.role === "SUPERADMIN") {
      return <Redirect href="/superadmin/dashboard" />;
    }
    if (user.role === "ADMIN") {
      return <Redirect href="/admin/dashboard" />;
    }
    if (user.role === "RIDER") {
      return <Redirect href="/rider/dashboard" />;
    }
    if (user.role === "USER") {
      return <Redirect href="/category" />;
    }
    return <Redirect href="/" />;
  }




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
      <Stack.Screen name="/user/order-success" />
      <Stack.Screen name="/user/order-history" />
      <Stack.Screen name="/user/order-tracking" />

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
      {/* --- RIDER ROUTES --- */}
      <Stack.Screen name="rider/dashboard" options={{ title: 'Rider Dashboard' }} />
      <Stack.Screen name="rider/order-details" options={{ title: 'Order Details' }} />
      <Stack.Screen name="rider/history" options={{ title: 'Delivery History' }} />
      <Stack.Screen name="rider/profile" options={{ title: 'My Profile' }} />

      {/* shops  */}

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