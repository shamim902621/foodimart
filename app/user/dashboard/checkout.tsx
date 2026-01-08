import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location'; // ✅ Import Location
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../lib/apiService";

// --- API FUNCTIONS ---
async function getCartById(userUUID: string, cartId: string) {
    if (!userUUID || !cartId) return null;
    const res: any = await api(`/users/cart/getcart/${userUUID}`);
    if (!res.success) throw new Error(res.message);
    return res.carts.find((c: any) => c._id === cartId) || null;
}

// ✅ Address APIs
async function fetchAddressesAPI(userUUID: string) {
    if (userUUID) {
        const res: any = await api(`/users/address/get/${userUUID}`);
        return res.success ? res.addresses : [];
    }
    return [];
}

async function createAddressAPI(userUUID: string, payload: any) {
    const res: any = await api(`/users/address/add/${userUUID}`, "POST", payload);
    if (!res.success) throw new Error(res.message);
    return res.address;
}

async function placeOrderAPI(userUUID: string, cartId: string, addressId: any, paymentMethod: string) {
    const res: any = await api(`/users/order/place`, "POST", {
        userUUID,
        cartId,
        addressId, // Sending ID instead of raw string is better
        paymentMethod
    });
    if (!res.success) throw new Error(res.message);
    return res.order;
}

// --- MAIN COMPONENT ---
export default function CheckoutScreen() {
    const { cartId } = useLocalSearchParams<{ cartId: string }>();
    const { user } = useAuth();

    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    // --- ADDRESS STATE ---
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    // New Address Form
    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
        isDefault: false
    });

    useEffect(() => {
        if (user?.userUUID && cartId) {
            loadData(user.userUUID, cartId);
        }
    }, [user, cartId]);

    const loadData = async (userId: string, cId: string) => {
        try {
            setLoading(true);
            // 1. Load Cart
            const cartData = await getCartById(userId, cId);
            setCart(cartData);

            // 2. Load Addresses
            if (user?.userUUID) {

                const addressData = await fetchAddressesAPI(user.userUUID);
                setAddresses(addressData);

                // 3. Auto-select default or first address
                if (addressData.length > 0) {
                    const defaultAddr = addressData.find((a: any) => a.isDefault) || addressData[0];
                    setSelectedAddress(defaultAddr);
                }
            }
        } catch (e) {
            console.log("Error loading data", e);
        } finally {
            setLoading(false);
        }
    };

    // --- 📍 CURRENT LOCATION LOGIC ---
    const handleUseCurrentLocation = async () => {
        setLocationLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            let geocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (geocode.length > 0) {
                const addr = geocode[0];
                console.log("Detected Address:", addr); // Debugging ke liye

                setNewAddress(prev => ({
                    ...prev,
                    city: addr.city || addr.subregion || '', // Kabhi kabhi city subregion me hoti h
                    state: addr.region || addr.subregion || 'State', // State pakadna zaroori h
                    zipCode: addr.postalCode || '',
                    addressLine1: `${addr.streetNumber || ''} ${addr.street || ''} ${addr.name || ''}`.trim(),
                    addressLine2: addr.district || ''
                }));
            }
        } catch (error) {
            Alert.alert("Error", "Could not fetch location");
        } finally {
            setLocationLoading(false);
        }
    };

    const handleSaveAddress = async () => {

        // STATE check add kiya hai
        if (!newAddress.addressLine1 || !newAddress.city || !newAddress.zipCode || !newAddress.state) {
            Alert.alert("Required", "Please fill Address, City, State and Zip Code");
            return;
        }

        try {
            const savedAddr = await createAddressAPI(user!.userUUID || "", newAddress);
            // Add to list and select it
            setAddresses([savedAddr, ...addresses]);
            setSelectedAddress(savedAddr);
            setIsAddingNew(false);
            setShowAddressModal(false);
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to save address");
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Alert.alert("Missing Address", "Please select a delivery address.");
            return;
        }

        try {
            setPlacingOrder(true);
            // Using selectedAddress.id (assuming SQL ID) or ._id (MongoDB)
            await placeOrderAPI(user!.userUUID || "", cartId!, selectedAddress.id || selectedAddress._id, paymentMethod);

            Alert.alert("Order Placed! 🎉", "Your food is on the way.", [
                { text: "OK", onPress: () => router.replace("/order-tracking") }
            ]);
        } catch (error: any) {
            Alert.alert("Order Failed", error.message);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return <ActivityIndicator style={styles.center} size="large" color="#FF6B35" />;
    if (!cart) return <View style={styles.center}><Text>Cart Error</Text></View>;

    return (
        <View style={styles.container}>
            <AppHeader
                title="Checkout"
                showBack={true}
            />
            <ScrollView style={styles.scrollView}>

                {/* 1. DELIVERY ADDRESS SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name="location" size={24} color="#FF6B35" />
                            <View style={{ flex: 1 }}>
                                {selectedAddress ? (
                                    <>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                            <Text style={styles.addrType}>{selectedAddress.type}</Text>
                                        </View>
                                        <Text style={styles.addrText}>
                                            {selectedAddress.addressLine1}, {selectedAddress.city} - {selectedAddress.zipCode}
                                        </Text>
                                    </>
                                ) : (
                                    <Text style={{ color: '#888' }}>No address selected</Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => setShowAddressModal(true)}>
                                <Text style={styles.changeBtn}>CHANGE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 2. ORDER SUMMARY */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Items</Text>
                    <View style={styles.card}>
                        {cart.items.map((item: any) => (
                            <View key={item.productId} style={styles.itemRow}>
                                <Text style={styles.qtyBadge}>{item.quantity}x</Text>
                                <Text style={{ flex: 1 }} numberOfLines={1}>{item.name}</Text>
                                <Text style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</Text>
                            </View>
                        ))}
                        <View style={styles.divider} />
                        <View style={styles.billRow}><Text>Grand Total</Text><Text style={styles.totalVal}>₹{cart.total}</Text></View>
                    </View>
                </View>

                {/* 3. PAYMENT METHOD */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment</Text>
                    <TouchableOpacity
                        style={[styles.paymentOpt, paymentMethod === 'COD' && styles.activePay]}
                        onPress={() => setPaymentMethod('COD')}>
                        <Ionicons name="cash-outline" size={20} color={paymentMethod === 'COD' ? "#FF6B35" : "#000"} />
                        <Text style={[styles.payText, paymentMethod === 'COD' && { color: '#FF6B35' }]}>Cash on Delivery</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.footer}>
                <View><Text style={{ color: '#666' }}>Total</Text><Text style={styles.footerTotal}>₹{cart.total}</Text></View>
                <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder} disabled={placingOrder}>
                    {placingOrder ? <ActivityIndicator color="#FFF" /> : <Text style={styles.placeText}>Place Order</Text>}
                </TouchableOpacity>
            </View>


            {/* --- ADDRESS SELECTION MODAL --- */}
            <Modal visible={showAddressModal} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{isAddingNew ? "Add New Address" : "Select Address"}</Text>
                        <TouchableOpacity onPress={() => { setShowAddressModal(false); setIsAddingNew(false); }}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={{ padding: 20 }}>

                        {isAddingNew ? (
                            // === ADD ADDRESS FORM ===
                            <View style={{ gap: 15 }}>
                                {/* CURRENT LOCATION BUTTON */}
                                <TouchableOpacity style={styles.gpsBtn} onPress={handleUseCurrentLocation}>
                                    {locationLoading ? <ActivityIndicator color="#FF6B35" /> : <Ionicons name="navigate" size={18} color="#FF6B35" />}
                                    <Text style={styles.gpsText}>Use Current Location</Text>
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    {['Home', 'Work', 'Other'].map(type => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[styles.typeChip, newAddress.type === type && styles.activeChip]}
                                            onPress={() => setNewAddress({ ...newAddress, type: type as any })}
                                        >
                                            <Text style={[styles.chipText, newAddress.type === type && { color: '#FFF' }]}>{type}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* ... Type Chips ... */}

                                <TextInput
                                    placeholder="Address Line 1 (House No, Building)"
                                    style={styles.input}
                                    value={newAddress.addressLine1}
                                    onChangeText={t => setNewAddress({ ...newAddress, addressLine1: t })}
                                />
                                <TextInput
                                    placeholder="Address Line 2 (Road, Area, Landmark)"
                                    style={styles.input}
                                    value={newAddress.addressLine2}
                                    onChangeText={t => setNewAddress({ ...newAddress, addressLine2: t })}
                                />

                                {/* --- Updated Row with State --- */}
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TextInput
                                        placeholder="City"
                                        style={[styles.input, { flex: 1 }]}
                                        value={newAddress.city}
                                        onChangeText={t => setNewAddress({ ...newAddress, city: t })}
                                    />
                                    <TextInput
                                        placeholder="State"  // ✅ Added State Input
                                        style={[styles.input, { flex: 1 }]}
                                        value={newAddress.state}
                                        onChangeText={t => setNewAddress({ ...newAddress, state: t })}
                                    />
                                </View>

                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TextInput
                                        placeholder="Pincode"
                                        style={[styles.input, { flex: 1 }]}
                                        keyboardType="numeric"
                                        value={newAddress.zipCode}
                                        onChangeText={t => setNewAddress({ ...newAddress, zipCode: t })}
                                    />
                                    {/* Optional: Landmark alag input bana sakte ho agar chaho */}
                                </View>

                                {/* ... Save Button ... */}

                                <TouchableOpacity style={styles.saveAddrBtn} onPress={handleSaveAddress}>
                                    <Text style={styles.saveAddrText}>Save Address</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setIsAddingNew(false)}>
                                    <Text style={{ textAlign: 'center', color: '#666', marginTop: 10 }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // === ADDRESS LIST ===
                            <View>
                                <TouchableOpacity style={styles.addNewBtn} onPress={() => setIsAddingNew(true)}>
                                    <Ionicons name="add" size={20} color="#FF6B35" />
                                    <Text style={{ color: '#FF6B35', fontWeight: '700' }}>Add New Address</Text>
                                </TouchableOpacity>

                                {addresses.map((addr: any) => (
                                    <TouchableOpacity
                                        key={addr.id || addr._id}
                                        style={[styles.addrOption, selectedAddress?._id === addr._id && styles.selectedOption]}
                                        onPress={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                                <Text style={styles.addrType}>{addr.type}</Text>
                                                {addr.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
                                            </View>
                                            <Text style={styles.addrText}>
                                                {addr.addressLine1}, {addr.city}, {addr.zipCode}
                                            </Text>
                                        </View>
                                        {selectedAddress?._id === addr._id && (
                                            <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                    </ScrollView>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5" },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: "row", alignItems: "center", paddingTop: 50, padding: 20, backgroundColor: "#FFF" },
    headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 16 },
    scrollView: { flex: 1, padding: 16 },

    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: '#333' },
    addressCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, elevation: 1 },
    addrType: { fontSize: 12, fontWeight: '700', backgroundColor: '#EEE', paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden', marginRight: 6 },
    addrText: { color: '#555', fontSize: 14, lineHeight: 20 },
    changeBtn: { color: '#FF6B35', fontWeight: '700', fontSize: 12 },

    card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16 },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    qtyBadge: { backgroundColor: '#FFF0E6', color: '#FF6B35', paddingHorizontal: 6, borderRadius: 4, marginRight: 8, fontSize: 12, fontWeight: '700' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
    billRow: { flexDirection: 'row', justifyContent: 'space-between' },
    totalVal: { fontSize: 16, fontWeight: '700', color: '#FF6B35' },

    paymentOpt: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
    activePay: { borderColor: '#FF6B35', backgroundColor: '#FFF5F0' },
    payText: { marginLeft: 10, fontWeight: '600' },

    footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30 },
    footerTotal: { fontSize: 20, fontWeight: '700' },
    placeBtn: { backgroundColor: '#2E7D32', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
    placeText: { color: '#FFF', fontWeight: '700' },

    // MODAL STYLES
    modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF' },
    modalTitle: { fontSize: 18, fontWeight: '700' },

    addNewBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 15, backgroundColor: '#FFF', marginBottom: 15, borderRadius: 8 },
    addrOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
    selectedOption: { borderColor: '#FF6B35', backgroundColor: '#FFF5F0' },
    defaultBadge: { fontSize: 10, color: '#666' },

    // FORM STYLES
    input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD' },
    gpsBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, justifyContent: 'center', borderWidth: 1, borderColor: '#FF6B35', borderRadius: 8, marginBottom: 10 },
    gpsText: { color: '#FF6B35', fontWeight: '600' },
    typeChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#DDD', borderRadius: 20 },
    activeChip: { backgroundColor: '#FF6B35' },
    chipText: { fontSize: 12, fontWeight: '600', color: '#333' },
    saveAddrBtn: { backgroundColor: '#FF6B35', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    saveAddrText: { color: '#FFF', fontWeight: '700' }
});