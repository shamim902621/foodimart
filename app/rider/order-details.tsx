import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { api } from "../lib/apiService";

export default function RiderOrderDetails() {
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const router = useRouter();
    
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [otpInput, setOtpInput] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    // Fetch Details
    const fetchDetails = async () => {
        try {
            const res: any = await api(`/users/orders/${orderId}`); // Reuse existing Get Order API
            if (res.success) setOrder(res.order);
        } catch (e) {
            Alert.alert("Error", "Could not load order");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (orderId) fetchDetails(); }, [orderId]);

    // Update Status Logic
    const handleStatusUpdate = async (status: string) => {
        try {
            // If delivering, validate OTP
            const payload: any = { orderId, status };
            if (status === 'Delivered') {
                if(otpInput.length !== 4) return Alert.alert("Required", "Enter 4-digit OTP from customer");
                payload.otp = otpInput;
            }

            const res: any = await api('/riders/complete-order', 'POST', payload);
            
            if (res.success) {
                Alert.alert("Success", `Order Marked as ${status}`);
                if (status === 'Delivered') router.replace('/rider/dashboard');
                else fetchDetails(); // Refresh to see new status
            } else {
                Alert.alert("Failed", res.message);
            }
        } catch (e: any) {
            Alert.alert("Error", e.message);
        }
    };

    const callCustomer = () => {
        if(order?.customerInfo?.phone) Linking.openURL(`tel:${order.customerInfo.phone}`);
    };

    if (loading) return <ActivityIndicator style={{flex:1}} color="#FF6B35" />;
    if (!order) return <View><Text>Order Not Found</Text></View>;

    return (
        <View style={styles.container}>
            <AppHeader title="Order Details" showBack={true} />

            <ScrollView contentContainerStyle={{padding: 20}}>
                
                {/* Header Info */}
                <View style={styles.header}>
                    <Text style={styles.title}>Order #{order.orderNumber}</Text>
                    <Text style={[styles.status, {color: order.status === 'Delivered' ? '#2ECC71' : '#FF6B35'}]}>
                        {order.status}
                    </Text>
                </View>

                {/* Customer Details */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Customer</Text>
                    <Text style={styles.name}>{order.customerInfo.name}</Text>
                    <TouchableOpacity style={styles.callBtn} onPress={callCustomer}>
                        <Ionicons name="call" size={18} color="#FFF" />
                        <Text style={styles.callText}>Call Customer</Text>
                    </TouchableOpacity>
                </View>

                {/* Address */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <Text style={styles.address}>{order.deliveryAddress.fullAddress}</Text>
                    <Text style={styles.pincode}>PIN: {order.deliveryAddress.pincode}</Text>
                </View>

                {/* Bill */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Payment</Text>
                    <View style={styles.row}>
                        <Text>Amount to Collect:</Text>
                        <Text style={styles.amount}>
                            {order.paymentMethod === 'COD' && order.paymentStatus !== 'Completed' 
                                ? `₹${order.billDetails.grandTotal}` 
                                : 'Paid Online (₹0)'}
                        </Text>
                    </View>
                </View>

            </ScrollView>

            {/* ACTION FOOTER */}
            <View style={styles.footer}>
                {order.status === 'Preparing' || order.status === 'Ready' ? (
                    <TouchableOpacity style={styles.mainBtn} onPress={() => handleStatusUpdate('Out_for_Delivery')}>
                        <Text style={styles.btnText}>Pick Up Order</Text>
                    </TouchableOpacity>
                ) : order.status === 'Out_for_Delivery' ? (
                    <View>
                        {!showOtpInput ? (
                            <TouchableOpacity style={[styles.mainBtn, {backgroundColor: '#2ECC71'}]} onPress={() => setShowOtpInput(true)}>
                                <Text style={styles.btnText}>Deliver Order</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.otpContainer}>
                                <Text style={styles.otpLabel}>Enter Customer OTP</Text>
                                <TextInput 
                                    style={styles.otpInput} 
                                    placeholder="XXXX" 
                                    keyboardType="numeric"
                                    maxLength={4}
                                    value={otpInput}
                                    onChangeText={setOtpInput}
                                />
                                <TouchableOpacity style={styles.verifyBtn} onPress={() => handleStatusUpdate('Delivered')}>
                                    <Text style={styles.btnText}>Verify & Complete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ) : (
                    <Text style={{textAlign:'center', color:'#888', fontWeight:'bold'}}>Order Completed</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { marginBottom: 20 },
    title: { fontSize: 22, fontWeight: 'bold' },
    status: { fontSize: 16, fontWeight: '600', marginTop: 5 },
    
    card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
    sectionTitle: { fontSize: 14, color: '#888', marginBottom: 8, textTransform: 'uppercase', fontWeight: 'bold' },
    name: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    
    callBtn: { flexDirection: 'row', backgroundColor: '#333', padding: 10, borderRadius: 8, alignItems: 'center', alignSelf: 'flex-start', gap: 8 },
    callText: { color: '#FFF', fontWeight: 'bold' },
    
    address: { fontSize: 16, color: '#333', lineHeight: 22 },
    pincode: { marginTop: 5, color: '#666' },
    
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    amount: { fontSize: 18, fontWeight: 'bold', color: '#E74C3C' },

    footer: { padding: 20, backgroundColor: '#FFF', elevation: 10 },
    mainBtn: { backgroundColor: '#FF6B35', padding: 15, borderRadius: 10, alignItems: 'center' },
    btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

    otpContainer: { gap: 10 },
    otpLabel: { textAlign: 'center', fontWeight: 'bold' },
    otpInput: { borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 12, textAlign: 'center', fontSize: 18, letterSpacing: 5 },
    verifyBtn: { backgroundColor: '#2ECC71', padding: 15, borderRadius: 10, alignItems: 'center' }
});