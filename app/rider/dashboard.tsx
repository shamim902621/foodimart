// import { Ionicons } from '@expo/vector-icons';
// import * as Location from 'expo-location';
// import { useEffect, useState } from "react";
// import { Alert, FlatList, RefreshControl, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
// import { useAuth } from "../context/AuthContext";
// import { api } from "../lib/apiService";

// export default function RiderDashboard() {
//         const { user } = useAuth();
//         const [isOnline, setIsOnline] = useState(false);
//         const [orders, setOrders] = useState([]);
//         const [loading, setLoading] = useState(false);

//         // 1️⃣ Toggle Online/Offline + Send Location
//         const toggleSwitch = async () => {
//                 const newState = !isOnline;
//                 setIsOnline(newState);

//                 let lat = 0, long = 0;
//                 if (newState) {
//                         let { status } = await Location.requestForegroundPermissionsAsync();
//                         if (status === 'granted') {
//                                 let loc = await Location.getCurrentPositionAsync({});
//                                 lat = loc.coords.latitude;
//                                 long = loc.coords.longitude;
//                         }
//                 }

//                 // API Call to update status
//                 await api('/riders/update-status', 'PATCH', {
//                         isOnline: newState,
//                         latitude: lat,
//                         longitude: long
//                 });
//         };

//         // 2️⃣ Fetch Assigned Orders
//         const fetchOrders = async () => {
//                 setLoading(true);
//                 const res: any = await api('/riders/my-orders');
//                 if (res.success) setOrders(res.orders);
//                 setLoading(false);
//         };

//         useEffect(() => {
//                 fetchOrders();
//         }, []);

//         // 3️⃣ Action: Pick Up / Deliver
//         const handleStatusUpdate = async (orderId: string, newStatus: string) => {
//                 if (newStatus === 'Delivered') {
//                         // Ask for OTP
//                         Alert.prompt(
//                                 "Delivery Verification",
//                                 "Ask customer for 4-digit OTP",
//                                 [
//                                         { text: "Cancel", style: "cancel" },
//                                         {
//                                                 text: "Verify",
//                                                 onPress: async (otp: any) => {
//                                                         if (!otp) return;
//                                                         await callUpdateAPI(orderId, newStatus, otp);
//                                                 }
//                                         }
//                                 ],
//                                 "plain-text"
//                         );
//                 } else {
//                         await callUpdateAPI(orderId, newStatus);
//                 }
//         };

//         const callUpdateAPI = async (orderId: string, status: string, otp?: string) => {
//                 const res: any = await api('/riders/complete-order', 'POST', { orderId, status, otp });
//                 if (res.success) {
//                         Alert.alert("Success", "Order Updated");
//                         fetchOrders();
//                 } else {
//                         Alert.alert("Error", res.message);
//                 }
//         };

//         const renderOrder = ({ item }: { item: any }) => (
//                 <View style={styles.card}>
//                         <View style={styles.row}>
//                                 <Text style={styles.orderId}>#{item.orderNumber}</Text>
//                                 <Text style={styles.price}>₹{item.billDetails.grandTotal}</Text>
//                         </View>
//                         <Text style={styles.address}>📍 {item.deliveryAddress.fullAddress}</Text>

//                         <View style={styles.btnRow}>
//                                 {item.status === 'Preparing' || item.status === 'Ready' ? (
//                                         <TouchableOpacity style={styles.btnPickup} onPress={() => handleStatusUpdate(item._id, 'Out_for_Delivery')}>
//                                                 <Text style={styles.btnText}>Pick Up Order</Text>
//                                         </TouchableOpacity>
//                                 ) : (
//                                         <TouchableOpacity style={styles.btnDeliver} onPress={() => handleStatusUpdate(item._id, 'Delivered')}>
//                                                 <Text style={styles.btnText}>Verify & Deliver (OTP)</Text>
//                                         </TouchableOpacity>
//                                 )}

//                                 {/* Call Customer Button */}
//                                 <TouchableOpacity style={styles.btnCall}>
//                                         <Ionicons name="call" size={20} color="#333" />
//                                 </TouchableOpacity>
//                         </View>
//                 </View>
//         );

//         return (
//                 <View style={styles.container}>
//                         {/* Header with Switch */}
//                         <View style={styles.header}>
//                                 <Text style={styles.title}>Rider Dashboard</Text>
//                                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//                                         <Text style={{ color: isOnline ? '#2ECC71' : '#AAA' }}>{isOnline ? 'Online' : 'Offline'}</Text>
//                                         <Switch value={isOnline} onValueChange={toggleSwitch} />
//                                 </View>
//                         </View>

//                         <FlatList
//                                 data={orders}
//                                 renderItem={renderOrder}
//                                 keyExtractor={(item: any) => item._id}
//                                 refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
//                                 ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>No active orders</Text>}
//                         />
//                 </View>
//         );
// }

// const styles = StyleSheet.create({
//         container: { flex: 1, backgroundColor: '#F5F5F5', padding: 15 },
//         header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 40 },
//         title: { fontSize: 22, fontWeight: 'bold' },
//         card: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 2 },
//         row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
//         orderId: { fontWeight: 'bold', fontSize: 16 },
//         price: { fontWeight: 'bold', color: '#2ECC71', fontSize: 16 },
//         address: { color: '#555', marginBottom: 15 },
//         btnRow: { flexDirection: 'row', gap: 10 },
//         btnPickup: { flex: 1, backgroundColor: '#FF6B35', padding: 12, borderRadius: 8, alignItems: 'center' },
//         btnDeliver: { flex: 1, backgroundColor: '#2ECC71', padding: 12, borderRadius: 8, alignItems: 'center' },
//         btnCall: { backgroundColor: '#EEE', padding: 12, borderRadius: 8, justifyContent: 'center' },
//         btnText: { color: '#FFF', fontWeight: 'bold' }
// });


import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from "react";
import {
        Alert,
        FlatList,
        RefreshControl,
        StyleSheet,
        Switch,
        Text,
        TouchableOpacity,
        View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/apiService";

export default function RiderDashboard() {
        const { user } = useAuth();
        const [isOnline, setIsOnline] = useState(false);
        const [orders, setOrders] = useState([]);
        const [loading, setLoading] = useState(false);

        // 1️⃣ Toggle Online/Offline + Send Location
        const toggleSwitch = async () => {
                const newState = !isOnline;
                setIsOnline(newState);

                let lat = 0, long = 0;
                if (newState) {
                        let { status } = await Location.requestForegroundPermissionsAsync();
                        if (status !== 'granted') {
                                Alert.alert("Permission Denied", "Location is required to go online.");
                                setIsOnline(false);
                                return;
                        }
                        let loc = await Location.getCurrentPositionAsync({});
                        lat = loc.coords.latitude;
                        long = loc.coords.longitude;
                }

                // Call API
                try {
                        await api('/riders/update-status', 'PATCH', {
                                isOnline: newState,
                                latitude: lat,
                                longitude: long
                        });
                } catch (e) {
                        console.log("Status Update Failed", e);
                }
        };


        const handleOrderAction = async (orderId: string, action: 'accept' | 'reject') => {
                try {
                        const res: any = await api('/riders/order-action', 'POST', { orderId, action });
                        if (res.success) {
                                Alert.alert("Success", action === 'accept' ? "Order Accepted!" : "Order Rejected");
                                fetchOrders(); // Refresh list
                        }
                } catch (e) {
                        Alert.alert("Error", "Action failed");
                }
        };

        // 2️⃣ Fetch Assigned Orders
        const fetchOrders = async () => {
                setLoading(true);
                try {
                        const res: any = await api('/riders/my-orders'); // Ensure this API exists on backend
                        if (res.success) setOrders(res.orders);
                } catch (e) {
                        console.log(e);
                } finally {
                        setLoading(false);
                }
        };

        useEffect(() => {
                fetchOrders();
        }, []);
        // 3️⃣ Card Component
        // const prenderOrder = ({ item }: { item: any }) => (

        //         <TouchableOpacity
        //                 style={styles.card}
        //                 onPress={() => router.push({ pathname: "/rider/order-details", params: { orderId: item._id } })}
        //         >
        //                 <View style={styles.cardHeader}>
        //                         <Text style={styles.orderId}>Order #{item.orderNumber?.slice(-6)}</Text>
        //                         <View style={styles.statusBadge}>
        //                                 <Text style={styles.statusText}>{item.status}</Text>
        //                         </View>
        //                 </View>

        //                 <View style={styles.row}>
        //                         <Ionicons name="storefront" size={16} color="#666" />
        //                         <Text style={styles.address} numberOfLines={1}>Pickup: Shop Location</Text>
        //                 </View>

        //                 <View style={styles.row}>
        //                         <Ionicons name="location" size={16} color="#FF6B35" />
        //                         <Text style={styles.address} numberOfLines={1}>Deliver: {item.deliveryAddress.fullAddress}</Text>
        //                 </View>

        //                 <View style={styles.divider} />

        //                 <View style={styles.footer}>
        //                         <Text style={styles.price}>₹{item.billDetails.grandTotal}</Text>
        //                         <Text style={styles.date}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
        //                 </View>
        //         </TouchableOpacity>
        // );

        const renderOrder = ({ item }: { item: any }) => {
                // Logic: If status is 'Ready' (Assigned by Admin), show Accept/Reject
                // If status is 'Preparing' or 'Out_for_Delivery', show details (Already Accepted)
                const isNewRequest = item.status === 'Ready'; // Assuming 'Ready' means assigned but not started

                return (
                        <View style={styles.card}>
                                <TouchableOpacity onPress={() => router.push({ pathname: "/rider/order-details", params: { orderId: user?.id } })}>
                                        <View style={styles.cardHeader}>
                                                <Text style={styles.orderId}>Order #{item.orderNumber?.slice(-6)}</Text>
                                                <View style={[styles.statusBadge, { backgroundColor: isNewRequest ? '#FFEB3B' : '#E8F5E9' }]}>
                                                        <Text style={[styles.statusText, { color: isNewRequest ? '#FBC02D' : '#2ECC71' }]}>
                                                                {isNewRequest ? 'NEW REQUEST' : item.status}
                                                        </Text>
                                                </View>
                                        </View>

                                        {/* Address Info (Keep existing code) */}
                                        <View style={styles.row}>
                                                <Ionicons name="storefront" size={16} color="#666" />
                                                <Text style={styles.address}>Pickup: Shop Location</Text>
                                        </View>
                                        <View style={styles.row}>
                                                <Ionicons name="location" size={16} color="#FF6B35" />
                                                <Text style={styles.address}>Deliver: {item.deliveryAddress.fullAddress}</Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.footer}>
                                                <Text style={styles.price}>₹{item.billDetails.grandTotal}</Text>
                                                <Text style={styles.date}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
                                        </View>
                                </TouchableOpacity>

                                {/* 🔥 ACCEPT / REJECT BUTTONS (Only for New Requests) */}
                                {isNewRequest && (
                                        <View style={styles.actionRow}>
                                                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleOrderAction(item._id, 'reject')}>
                                                        <Text style={styles.btnText}>Reject</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.acceptBtn} onPress={() => handleOrderAction(item._id, 'accept')}>
                                                        <Text style={styles.btnText}>Accept Order</Text>
                                                </TouchableOpacity>
                                        </View>
                                )}
                        </View>
                );
        };


        return (
                <View style={styles.container}>
                        <AppHeader  title="Delivery Dashboard" showBack={true} />

                        {/* Status Bar */}
                        <View style={[styles.statusBar, isOnline ? styles.online : styles.offline]}>
                                <Text style={styles.statusTitle}>
                                        {isOnline ? "You are Online" : "You are Offline"}
                                </Text>
                                <Switch
                                        value={isOnline}
                                        onValueChange={toggleSwitch}
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={isOnline ? "#fff" : "#f4f3f4"}
                                />
                        </View>

                        {/* Menu Grid */}
                        <View style={styles.menuGrid}>
                                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/rider/profile')}>
                                        <Ionicons name="person" size={20} color="#333" />
                                        <Text style={styles.menuText}>Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/rider/history')}>
                                        <Ionicons name="time" size={20} color="#333" />
                                        <Text style={styles.menuText}>History</Text>
                                </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionTitle}>Assigned Orders</Text>

                        {/* <FlatList
                                data={orders}
                                renderItem={renderOrder}
                                keyExtractor={(item: any) => item._id}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
                                ListEmptyComponent={
                                        <View style={styles.empty}>
                                                <Ionicons name="bicycle-outline" size={50} color="#CCC" />
                                                <Text style={{ color: '#888', marginTop: 10 }}>No active orders</Text>
                                        </View>
                                }
                        /> */}
                        <FlatList
                                data={orders}
                                renderItem={renderOrder}
                                keyExtractor={(item: any) => item._id}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} />}
                        />
                </View>
        );
}

const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: '#F5F5F5' },
        statusBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, margin: 15, borderRadius: 10 },
        online: { backgroundColor: '#2ECC71' },
        offline: { backgroundColor: '#333' },
        statusTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

        menuGrid: { flexDirection: 'row', paddingHorizontal: 15, gap: 10, marginBottom: 20 },
        menuItem: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, elevation: 1 },
        menuText: { fontWeight: '600' },

        sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 15, marginBottom: 10, color: '#333' },

        card: { backgroundColor: '#FFF', marginHorizontal: 15, marginBottom: 15, padding: 15, borderRadius: 10, elevation: 2 },
        cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
        orderId: { fontWeight: 'bold', fontSize: 16 },
        statusBadge: { backgroundColor: '#FFF0E6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
        statusText: { color: '#FF6B35', fontSize: 12, fontWeight: 'bold' },

        row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
        address: { color: '#555', fontSize: 13, flex: 1 },
        divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },

        footer: { flexDirection: 'row', justifyContent: 'space-between' },
        price: { fontWeight: 'bold', fontSize: 16, color: '#2ECC71' },
        date: { color: '#999', fontSize: 12 },

        empty: { alignItems: 'center', marginTop: 50 },
        actionRow: { flexDirection: 'row', gap: 10, marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderColor: '#EEE' },
        acceptBtn: { flex: 1, backgroundColor: '#2ECC71', padding: 12, borderRadius: 8, alignItems: 'center' },
        rejectBtn: { flex: 1, backgroundColor: '#FF4444', padding: 12, borderRadius: 8, alignItems: 'center' },
        btnText: { color: '#FFF', fontWeight: 'bold' }
});