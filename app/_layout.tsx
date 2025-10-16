import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="otp-verification" options={{ title: 'Verify OTP' }} />
      <Stack.Screen name="shop" options={{ title: 'Shop' }} />
      <Stack.Screen name="filters" options={{ title: 'Filters', presentation: 'modal' }} />
      <Stack.Screen name="product-detail" options={{ title: 'Product Details' }} />
      <Stack.Screen name="shipping-method" options={{ title: 'Shipping Method' }} />
      <Stack.Screen name="shipping-address" options={{ title: 'Shipping Address' }} />
      <Stack.Screen name="payment-method" options={{ title: 'Payment Method' }} />
      <Stack.Screen name="order-success" options={{ headerShown: false }} />
      <Stack.Screen name="order-tracking" options={{ title: 'Order Tracking' }} />
      <Stack.Screen name="user-orders" options={{ title: 'My Orders' }} />
    </Stack>
  );
}