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
