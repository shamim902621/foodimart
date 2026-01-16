// import AppHeader from '@/components/profileHeader';
// import { Ionicons } from '@expo/vector-icons';
// import * as Location from 'expo-location';
// import { router, useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//     ActivityIndicator,
//     Alert,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from "react-native";
// import { useAuth } from "../../context/AuthContext";
// import { api } from "../../lib/apiService";

// // ✅ 1. Define Address Interface
// interface Address {
//     id?: string;          // For SQL (Sequelize)
//     // _id?: string;         // For MongoDB (Fallback)
//     type: string;         // 'Home' | 'Work' | 'Other'
//     addressLine1: string;
//     addressLine2?: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     landmark?: string;
//     isDefault?: boolean;
// }

// // --- API FUNCTIONS ---
// async function getCartById(userUUID: string, cartId: string) {
//     if (!userUUID || !cartId) return null;
//     const res: any = await api(`/users/cart/getcart/${userUUID}`);
//     if (!res.success) throw new Error(res.message);
//     return res.carts.find((c: any) => c._id === cartId) || null;
// }

// async function fetchAddressesAPI(userUUID: string): Promise<Address[]> {
//     if (userUUID) {
//         const res: any = await api(`/users/address/get/${userUUID}`);
//         return res.success ? res.addresses : [];
//     }
//     return [];
// }

// async function createAddressAPI(userUUID: string, payload: Address) {
//     const res: any = await api(`/users/address/add/${userUUID}`, "POST", payload);
//     if (!res.success) throw new Error(res.message);
//     return res.address;
// }

// async function placeOrderAPI(userUUID: string, cartId: string, addressId: string, paymentMethod: string) {
//     const res: any = await api(`/users/orders/place/createOrder`, "POST", {
//         userUUID,
//         cartId,
//         addressId,
//         paymentMethod
//     });
//     if (!res.success) throw new Error(res.message);
//     return res.order;
// }

// // --- MAIN COMPONENT ---
// export default function CheckoutScreen() {
//     const { cartId } = useLocalSearchParams<{ cartId: string }>();
//     const { user } = useAuth();

//     const [cart, setCart] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [placingOrder, setPlacingOrder] = useState(false);
//     const [paymentMethod, setPaymentMethod] = useState("COD");

//     // ✅ Use Address Interface here
//     const [addresses, setAddresses] = useState<Address[]>([]);
//     const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

//     // UI State
//     const [showAddressModal, setShowAddressModal] = useState(false);
//     const [isAddingNew, setIsAddingNew] = useState(false);
//     const [locationLoading, setLocationLoading] = useState(false);

//     // ✅ New Address Form State
//     const [newAddress, setNewAddress] = useState<Address>({
//         type: 'Home',
//         addressLine1: '',
//         addressLine2: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         landmark: '',
//         isDefault: false
//     });

//     useEffect(() => {
//         if (user?.userUUID && cartId) {
//             loadData(user.userUUID, cartId);
//         }
//     }, [user, cartId]);

//     const loadData = async (userId: string, cId: string) => {
//         try {
//             setLoading(true);
//             // 1. Load Cart
//             const cartData = await getCartById(userId, cId);
//             setCart(cartData);

//             // 2. Load Addresses
//             if (user?.userUUID) {
//                 const addressData = await fetchAddressesAPI(user.userUUID);
//                 setAddresses(addressData);

//                 // 3. Auto-select default or first address
//                 if (addressData.length > 0) {
//                     const defaultAddr = addressData.find((a) => a.isDefault) || addressData[0];
//                     setSelectedAddress(defaultAddr);
//                 }
//             }
//         } catch (e) {
//             console.log("Error loading data", e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // --- 📍 CURRENT LOCATION LOGIC ---
//     const handleUseCurrentLocation = async () => {
//         setLocationLoading(true);
//         try {
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Permission to access location was denied');
//                 return;
//             }

//             let location = await Location.getCurrentPositionAsync({});
//             let geocode = await Location.reverseGeocodeAsync({
//                 latitude: location.coords.latitude,
//                 longitude: location.coords.longitude
//             });

//             if (geocode.length > 0) {
//                 const addr = geocode[0];
//                 console.log("Detected Address:", addr);

//                 setNewAddress(prev => ({
//                     ...prev,
//                     city: addr.city || addr.subregion || '',
//                     state: addr.region || addr.subregion || 'State',
//                     zipCode: addr.postalCode || '',
//                     addressLine1: `${addr.streetNumber || ''} ${addr.street || ''} ${addr.name || ''}`.trim(),
//                     addressLine2: addr.district || ''
//                 }));
//             }
//         } catch (error) {
//             Alert.alert("Error", "Could not fetch location");
//         } finally {
//             setLocationLoading(false);
//         }
//     };

//     const handleSaveAddress = async () => {
//         if (!newAddress.addressLine1 || !newAddress.city || !newAddress.zipCode || !newAddress.state) {
//             Alert.alert("Required", "Please fill Address, City, State and Zip Code");
//             return;
//         }

//         try {
//             const savedAddr = await createAddressAPI(user!.userUUID || "", newAddress);
//             setAddresses([savedAddr, ...addresses]);
//             setSelectedAddress(savedAddr);
//             setIsAddingNew(false);
//             setShowAddressModal(false);
//         } catch (e: any) {
//             Alert.alert("Error", e.message || "Failed to save address");
//         }
//     };

//     const handlePlaceOrder = async () => {
//         // 1. Validation
//         if (!selectedAddress) {
//             Alert.alert("Missing Address", "Please select a delivery address.");
//             return;
//         }

//         try {
//             setPlacingOrder(true);

//             // 2. Prepare Payload
//             // Using ID check (Handling both SQL 'id' and Mongo '_id')
//             const addressId = selectedAddress.id;

//             if (!addressId) {
//                 throw new Error("Invalid Address ID");
//             }

//             // 3. Call API
//             const order = await placeOrderAPI(
//                 user!.userUUID || "",
//                 cartId!,
//                 addressId,
//                 paymentMethod
//             );

//             // 4. Success Redirect
//             router.replace({
//                 pathname: "/user/order-success",
//                 params: { orderId: order._id || order.id } // Pass ID so success screen can fetch details
//             });

//         } catch (error: any) {
//             console.error("Order Failed", error);
//             Alert.alert("Order Failed", error.message || "Something went wrong");
//         } finally {
//             setPlacingOrder(false);
//         }
//     };

//     if (loading) return <ActivityIndicator style={styles.center} size="large" color="#FF6B35" />;
//     if (!cart) return <View style={styles.center}><Text>Cart Error</Text></View>;

//     return (
//         <View style={styles.container}>
//             <AppHeader title="Checkout" showBack={true} />
//             <ScrollView style={styles.scrollView}>

//                 {/* 1. DELIVERY ADDRESS SECTION */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Delivery Address</Text>
//                     <View style={styles.addressCard}>
//                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
//                             <Ionicons name="location" size={24} color="#FF6B35" />
//                             <View style={{ flex: 1 }}>
//                                 {selectedAddress ? (
//                                     <>
//                                         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
//                                             <Text style={styles.addrType}>{selectedAddress.type}</Text>
//                                         </View>
//                                         <Text style={styles.addrText}>
//                                             {selectedAddress.addressLine1}, {selectedAddress.city} - {selectedAddress.zipCode}
//                                         </Text>
//                                     </>
//                                 ) : (
//                                     <Text style={{ color: '#888' }}>No address selected</Text>
//                                 )}
//                             </View>
//                             <TouchableOpacity onPress={() => setShowAddressModal(true)}>
//                                 <Text style={styles.changeBtn}>CHANGE</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>

//                 {/* 2. ORDER SUMMARY */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Items</Text>
//                     <View style={styles.card}>
//                         {cart.items.map((item: any) => (
//                             <View key={item.productId} style={styles.itemRow}>
//                                 <Text style={styles.qtyBadge}>{item.quantity}x</Text>
//                                 <Text style={{ flex: 1 }} numberOfLines={1}>{item.name}</Text>
//                                 <Text style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</Text>
//                             </View>
//                         ))}
//                         <View style={styles.divider} />
//                         <View style={styles.billRow}><Text>Grand Total</Text><Text style={styles.totalVal}>₹{cart.total}</Text></View>
//                     </View>
//                 </View>

//                 {/* 3. PAYMENT METHOD */}
//                 <View style={styles.section}>
//                     <Text style={styles.sectionTitle}>Payment</Text>
//                     <TouchableOpacity
//                         style={[styles.paymentOpt, paymentMethod === 'COD' && styles.activePay]}
//                         onPress={() => setPaymentMethod('COD')}>
//                         <Ionicons name="cash-outline" size={20} color={paymentMethod === 'COD' ? "#FF6B35" : "#000"} />
//                         <Text style={[styles.payText, paymentMethod === 'COD' && { color: '#FF6B35' }]}>Cash on Delivery</Text>
//                     </TouchableOpacity>
//                 </View>

//                 <View style={{ height: 100 }} />
//             </ScrollView>

//             {/* FOOTER */}
//             <View style={styles.footer}>
//                 <View><Text style={{ color: '#666' }}>Total</Text><Text style={styles.footerTotal}>₹{cart.total}</Text></View>
//                 <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder} disabled={placingOrder}>
//                     {placingOrder ? <ActivityIndicator color="#FFF" /> : <Text style={styles.placeText}>Place Order</Text>}
//                 </TouchableOpacity>
//             </View>

//             {/* --- ADDRESS SELECTION MODAL --- */}
//             <Modal visible={showAddressModal} animationType="slide" presentationStyle="pageSheet">
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalHeader}>
//                         <Text style={styles.modalTitle}>{isAddingNew ? "Add New Address" : "Select Address"}</Text>
//                         <TouchableOpacity onPress={() => { setShowAddressModal(false); setIsAddingNew(false); }}>
//                             <Ionicons name="close" size={24} color="#333" />
//                         </TouchableOpacity>
//                     </View>

//                     <ScrollView contentContainerStyle={{ padding: 20 }}>
//                         {isAddingNew ? (
//                             // === ADD ADDRESS FORM ===
//                             <View style={{ gap: 15 }}>
//                                 <TouchableOpacity style={styles.gpsBtn} onPress={handleUseCurrentLocation}>
//                                     {locationLoading ? <ActivityIndicator color="#FF6B35" /> : <Ionicons name="navigate" size={18} color="#FF6B35" />}
//                                     <Text style={styles.gpsText}>Use Current Location</Text>
//                                 </TouchableOpacity>

//                                 <View style={{ flexDirection: 'row', gap: 10 }}>
//                                     {['Home', 'Work', 'Other'].map(type => (
//                                         <TouchableOpacity
//                                             key={type}
//                                             style={[styles.typeChip, newAddress.type === type && styles.activeChip]}
//                                             onPress={() => setNewAddress({ ...newAddress, type: type })}
//                                         >
//                                             <Text style={[styles.chipText, newAddress.type === type && { color: '#FFF' }]}>{type}</Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>

//                                 <TextInput
//                                     placeholder="Address Line 1 (House No, Building)"
//                                     style={styles.input}
//                                     value={newAddress.addressLine1}
//                                     onChangeText={t => setNewAddress({ ...newAddress, addressLine1: t })}
//                                 />
//                                 <TextInput
//                                     placeholder="Address Line 2 (Road, Area, Landmark)"
//                                     style={styles.input}
//                                     value={newAddress.addressLine2}
//                                     onChangeText={t => setNewAddress({ ...newAddress, addressLine2: t })}
//                                 />
//                                 <View style={{ flexDirection: 'row', gap: 10 }}>
//                                     <TextInput
//                                         placeholder="City"
//                                         style={[styles.input, { flex: 1 }]}
//                                         value={newAddress.city}
//                                         onChangeText={t => setNewAddress({ ...newAddress, city: t })}
//                                     />
//                                     <TextInput
//                                         placeholder="State"
//                                         style={[styles.input, { flex: 1 }]}
//                                         value={newAddress.state}
//                                         onChangeText={t => setNewAddress({ ...newAddress, state: t })}
//                                     />
//                                 </View>
//                                 <View style={{ flexDirection: 'row', gap: 10 }}>
//                                     <TextInput
//                                         placeholder="Pincode"
//                                         style={[styles.input, { flex: 1 }]}
//                                         keyboardType="numeric"
//                                         value={newAddress.zipCode}
//                                         onChangeText={t => setNewAddress({ ...newAddress, zipCode: t })}
//                                     />
//                                 </View>

//                                 <TouchableOpacity style={styles.saveAddrBtn} onPress={handleSaveAddress}>
//                                     <Text style={styles.saveAddrText}>Save Address</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         ) : (
//                             // === ADDRESS LIST ===
//                             <View>
//                                 <TouchableOpacity style={styles.addNewBtn} onPress={() => setIsAddingNew(true)}>
//                                     <Ionicons name="add" size={20} color="#FF6B35" />
//                                     <Text style={{ color: '#FF6B35', fontWeight: '700' }}>Add New Address</Text>
//                                 </TouchableOpacity>

//                                 {addresses.map((addr) => (
//                                     <TouchableOpacity
//                                         key={addr.id}
//                                         style={[styles.addrOption, (selectedAddress?.id) === (addr.id) && styles.selectedOption]}
//                                         onPress={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
//                                     >
//                                         <View style={{ flex: 1 }}>
//                                             <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
//                                                 <Text style={styles.addrType}>{addr.type}</Text>
//                                                 {addr.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
//                                             </View>
//                                             <Text style={styles.addrText}>
//                                                 {addr.addressLine1}, {addr.city}, {addr.zipCode}
//                                             </Text>
//                                         </View>
//                                         {(selectedAddress?.id) === (addr.id) && (
//                                             <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
//                                         )}
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                         )}
//                     </ScrollView>
//                 </View>
//             </Modal>
//         </View>
//     );
// }

// // ... Copy your styles from the previous message here ...
// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F5F5F5" },
//     center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//     header: { flexDirection: "row", alignItems: "center", paddingTop: 50, padding: 20, backgroundColor: "#FFF" },
//     headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 16 },
//     scrollView: { flex: 1, padding: 16 },

//     section: { marginBottom: 20 },
//     sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: '#333' },
//     addressCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, elevation: 1 },
//     addrType: { fontSize: 12, fontWeight: '700', backgroundColor: '#EEE', paddingHorizontal: 6, borderRadius: 4, overflow: 'hidden', marginRight: 6 },
//     addrText: { color: '#555', fontSize: 14, lineHeight: 20 },
//     changeBtn: { color: '#FF6B35', fontWeight: '700', fontSize: 12 },

//     card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16 },
//     itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//     qtyBadge: { backgroundColor: '#FFF0E6', color: '#FF6B35', paddingHorizontal: 6, borderRadius: 4, marginRight: 8, fontSize: 12, fontWeight: '700' },
//     divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
//     billRow: { flexDirection: 'row', justifyContent: 'space-between' },
//     totalVal: { fontSize: 16, fontWeight: '700', color: '#FF6B35' },

//     paymentOpt: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
//     activePay: { borderColor: '#FF6B35', backgroundColor: '#FFF5F0' },
//     payText: { marginLeft: 10, fontWeight: '600' },

//     footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30 },
//     footerTotal: { fontSize: 20, fontWeight: '700' },
//     placeBtn: { backgroundColor: '#2E7D32', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
//     placeText: { color: '#FFF', fontWeight: '700' },

//     // MODAL STYLES
//     modalContainer: { flex: 1, backgroundColor: '#F5F5F5' },
//     modalHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF' },
//     modalTitle: { fontSize: 18, fontWeight: '700' },

//     addNewBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, padding: 15, backgroundColor: '#FFF', marginBottom: 15, borderRadius: 8 },
//     addrOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
//     selectedOption: { borderColor: '#FF6B35', backgroundColor: '#FFF5F0' },
//     defaultBadge: { fontSize: 10, color: '#666' },

//     // FORM STYLES
//     input: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD' },
//     gpsBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, justifyContent: 'center', borderWidth: 1, borderColor: '#FF6B35', borderRadius: 8, marginBottom: 10 },
//     gpsText: { color: '#FF6B35', fontWeight: '600' },
//     typeChip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#DDD', borderRadius: 20 },
//     activeChip: { backgroundColor: '#FF6B35' },
//     chipText: { fontSize: 12, fontWeight: '600', color: '#333' },
//     saveAddrBtn: { backgroundColor: '#FF6B35', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
//     saveAddrText: { color: '#FFF', fontWeight: '700' }
// });




import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
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
import RazorpayCheckout from 'react-native-razorpay';
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/apiService";

// --- INTERFACES ---
interface Address {
    id?: string;
    _id?: string;
    type: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
}

// Add these new API calls
async function createRazorpayOrderAPI(amount: number) {
    const res: any = await api(`/payment/create-order`, "POST", { amount });
    if (!res.success) throw new Error(res.message);
    return res;
}

async function verifyRazorpayPaymentAPI(data: any) {
    const res: any = await api(`/payment/verify`, "POST", data);
    return res.success;
}

// --- CONSTANTS ---
const DELIVERY_FEE = 40; // ⚠️ Must match Backend Logic

// --- API FUNCTIONS ---
async function getCartById(userUUID: string, cartId: string) {
    if (!userUUID || !cartId) return null;
    const res: any = await api(`/users/cart/getcart/${userUUID}`);
    if (!res.success) throw new Error(res.message);
    return res.carts.find((c: any) => c._id === cartId) || null;
}

async function fetchAddressesAPI(userUUID: string): Promise<Address[]> {
    if (userUUID) {
        const res: any = await api(`/users/address/get/${userUUID}`);
        return res.success ? res.addresses : [];
    }
    return [];
}

async function createAddressAPI(userUUID: string, payload: Address) {
    const res: any = await api(`/users/address/add/${userUUID}`, "POST", payload);
    if (!res.success) throw new Error(res.message);
    return res.address;
}

async function placeOrderAPI(userUUID: string, cartId: string, addressId: string, paymentMethod: string) {
    // Note: Backend now calculates the totals, so we just send the IDs
    const res: any = await api(`/users/orders/place/createOrder`, "POST", {
        userUUID,
        cartId,
        addressId,
        paymentMethod
    });
    if (!res.success) throw new Error(res.message);
    return res.order;
}

export default function CheckoutScreen() {
    const { cartId } = useLocalSearchParams<{ cartId: string }>();
    const { user } = useAuth();

    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    // UI State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    // New Address Form
    const [newAddress, setNewAddress] = useState<Address>({
        type: 'Home',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
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
            const cartData = await getCartById(userId, cId);
            setCart(cartData);

            if (user?.userUUID) {
                const addressData = await fetchAddressesAPI(user.userUUID);
                setAddresses(addressData);
                if (addressData.length > 0) {
                    const defaultAddr = addressData.find((a) => a.isDefault) || addressData[0];
                    setSelectedAddress(defaultAddr);
                }
            }
        } catch (e) {
            console.log("Error loading data", e);
        } finally {
            setLoading(false);
        }
    };

    // Location & Address Handlers (Same as before)
    const handleUseCurrentLocation = async () => {
        setLocationLoading(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return Alert.alert('Permission denied');

            let location = await Location.getCurrentPositionAsync({});
            let geocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (geocode.length > 0) {
                const addr = geocode[0];
                setNewAddress(prev => ({
                    ...prev,
                    city: addr.city || addr.subregion || '',
                    state: addr.region || addr.subregion || 'State',
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
        if (!newAddress.addressLine1 || !newAddress.city || !newAddress.zipCode) {
            Alert.alert("Required", "Please fill Address, City and Zip Code");
            return;
        }
        try {
            const savedAddr = await createAddressAPI(user!.userUUID || "", newAddress);
            setAddresses([savedAddr, ...addresses]);
            setSelectedAddress(savedAddr);
            setIsAddingNew(false);
            setShowAddressModal(false);
        } catch (e: any) {
            Alert.alert("Error", e.message);
        }
    };
    // only work cod
    // const handlePlaceOrder = async () => {
    //     if (!selectedAddress) {
    //         Alert.alert("Missing Address", "Please select a delivery address.");
    //         return;
    //     }

    //     try {
    //         setPlacingOrder(true);
    //         const addressId = selectedAddress.id || selectedAddress._id;

    //         if (!addressId) throw new Error("Invalid Address ID");

    //         const order = await placeOrderAPI(user!.userUUID || "", cartId!, addressId, paymentMethod);

    //         router.replace({
    //             pathname: "/user/order-success",
    //             params: { orderId: order._id || order.id }
    //         });

    //     } catch (error: any) {
    //         console.error("Order Failed", error);
    //         Alert.alert("Order Failed", error.message || "Something went wrong");
    //     } finally {
    //         setPlacingOrder(false);
    //     }
    // };


    // ✅ MAIN CHECKOUT HANDLER
    const bhandlePlaceOrder = async () => {
        // 1. Validation
        if (!selectedAddress) {
            Alert.alert("Missing Address", "Please select a delivery address.");
            return;
        }

        const addressId = selectedAddress.id || selectedAddress._id;
        if (!addressId) return Alert.alert("Error", "Invalid Address ID");

        setPlacingOrder(true);

        try {
            // ==========================================
            // CASE 1: CASH ON DELIVERY (Simple Flow)
            // ==========================================
            if (paymentMethod === "COD") {
                const order = await placeOrderAPI(user!.userUUID || "", cartId!, addressId, "COD");

                // Redirect to Success
                router.replace({
                    pathname: "/user/order-success",
                    params: { orderId: order._id || order.id }
                });
            }

            // ==========================================
            // CASE 2: ONLINE PAYMENT (Razorpay Flow)
            // ==========================================
            else if (paymentMethod === "ONLINE") {

                // A. Calculate Amount (Grand Total)
                const itemTotal = cart.totalPrice || cart.total || 0;
                const grandTotal = itemTotal + DELIVERY_FEE;

                // B. Create Order ID on Razorpay Server
                // Note: Create this API wrapper if you haven't yet
                const rpRes: any = await api(`/payment/create-order`, "POST", { amount: grandTotal });

                if (!rpRes.success) throw new Error("Could not initiate payment");

                // C. Open Razorpay UI
                const options = {
                    description: 'Food Order',
                    image: 'https://cdn-icons-png.flaticon.com/512/7541/7541673.png', // Aapka App Logo
                    currency: 'INR',
                    key: rpRes.key_id, // Key from Backend
                    amount: rpRes.amount, // Amount in Paise (e.g., 2000 for ₹20)
                    name: 'FoodMart',
                    order_id: rpRes.order_id, // Order ID from Backend
                    prefill: {
                        email: user?.email || 'test@example.com',
                        contact: user?.mobile || '9999999999',
                        name: user?.firstName || 'User'
                    },
                    theme: { color: '#FF6B35' }
                };

                // D. Handle Payment Result
                RazorpayCheckout.open(options).then(async (data: any) => {
                    // ✅ PAYMENT SUCCESSFUL (User paid via UPI/Card)
                    console.log("Payment Success Data:", data);

                    // E. Verify Signature on Backend
                    const verifyRes: any = await api(`/payment/verify`, "POST", data);

                    if (verifyRes.success) {
                        // F. 🔥 CRITICAL STEP: CREATE ORDER IN DATABASE 🔥
                        // Ab hum wahi API call karenge jo COD me karte hain, bas method 'ONLINE' hoga
                        const dbOrder = await placeOrderAPI(
                            user!.userUUID || "",
                            cartId!,
                            addressId,
                            "ONLINE" // Payment Method
                        );

                        // G. Redirect to Tracking
                        router.replace({
                            pathname: "/user/order-success",
                            params: { orderId: dbOrder._id || dbOrder.id }
                        });
                    } else {
                        Alert.alert("Verification Failed", "Payment detected but verification failed.");
                    }

                }).catch((error: any) => {
                    // ❌ Payment Cancelled or Failed
                    // Error object ko pura print karo
                    console.log("❌ Razorpay Failed Full Error:", JSON.stringify(error));

                    // Specific error codes handle karo
                    if (error.code === 0) {
                        Alert.alert("Payment Cancelled", "User cancelled the payment.");
                    } else if (error.code === 2) {
                        Alert.alert("Network Error", "Internet connection lost during payment.");
                    } else {
                        Alert.alert("Payment Failed", error.description || "Something went wrong");
                    }
                    setPlacingOrder(false);
                });
            }

        } catch (error: any) {
            console.error("Order Process Failed", error);
            Alert.alert("Error", error.message || "Something went wrong");
            setPlacingOrder(false);
        }
    };
    // ✅ MAIN CHECKOUT HANDLER
    const handlePlaceOrder = async () => {
        // 1. Validation
        if (!selectedAddress) {
            Alert.alert("Missing Address", "Please select a delivery address.");
            return;
        }

        const addressId = selectedAddress.id || selectedAddress._id;
        if (!addressId) return Alert.alert("Error", "Invalid Address ID");

        setPlacingOrder(true);

        try {
            // 💰 UPDATED: Ensure Values are Numbers to prevent "Amount Error"
            const itemTotal = Number(cart?.totalPrice || cart?.total || 0);
            const grandTotal = itemTotal + Number(DELIVERY_FEE);

            // ==========================================
            // CASE 1: CASH ON DELIVERY (Simple Flow)
            // ==========================================
            if (paymentMethod === "COD") {
                const order = await placeOrderAPI(user!.userUUID || "", cartId!, addressId, "COD");

                router.replace({
                    pathname: "/user/order-success",
                    params: { orderId: order._id || order.id }
                });
            }

            // ==========================================
            // CASE 2: ONLINE PAYMENT (Razorpay Flow)
            // ==========================================
            else if (paymentMethod === "ONLINE") {

                // A. Create Order ID on Razorpay Server
                // Backend will handle the multiplication by 100
                const rpRes: any = await api(`/payment/create-order`, "POST", { amount: grandTotal });

                if (!rpRes.success) throw new Error("Could not initiate payment");

                // 🛡️ UPDATED: Safety Checks for Options
                const options = {
                    description: 'Food Order Payment',
                    image: 'https://cdn-icons-png.flaticon.com/512/7541/7541673.png',
                    currency: 'INR',
                    key: rpRes.key_id, // Key from Backend
                    amount: rpRes.amount, // Amount from Backend (in Paise)
                    name: 'FoodMart',
                    order_id: rpRes.order_id, // Order ID from Backend
                    prefill: {
                        email: user?.email || 'guest@foodmart.com', // Fallback email
                        contact: user?.mobile || '9999999999',      // Fallback mobile
                        name: user?.firstName || 'Valued Customer'
                    },
                    theme: { color: '#FF6B35' }
                };

                // B. Open Razorpay UI
                RazorpayCheckout.open(options).then(async (data: any) => {
                    // ✅ PAYMENT SUCCESSFUL
                    console.log("✅ Payment Success:", data);

                    // C. Verify Signature on Backend
                    const verifyRes: any = await api(`/payment/verify`, "POST", data);

                    if (verifyRes.success) {
                        // D. 🔥 PLACE ORDER IN DATABASE 🔥
                        const dbOrder = await placeOrderAPI(
                            user!.userUUID || "",
                            cartId!,
                            addressId,
                            "ONLINE" // Payment Method
                        );

                        // E. Redirect to Tracking
                        router.replace({
                            pathname: "/user/order-success",
                            params: { orderId: dbOrder._id || dbOrder.id }
                        });
                    } else {
                        Alert.alert("Verification Failed", "Payment detected but signature invalid. Contact Support.");
                        setPlacingOrder(false); // Stop loading if verification fails
                    }

                }).catch((error: any) => {
                    // ❌ Payment Cancelled or Failed
                    console.log("❌ Razorpay Error:", JSON.stringify(error));

                    // Improved Error Handling
                    const errorCode = error.code;
                    const errorDesc = error.description || "Transaction cancelled";

                    if (errorCode === 0) {
                        // User cancelled (Back button pressed) - No Alert needed, just log
                        console.log("User cancelled payment");
                    } else if (errorCode === 2) {
                        Alert.alert("Network Error", "Internet connection lost during payment.");
                    } else {
                        Alert.alert("Payment Failed", errorDesc);
                    }

                    setPlacingOrder(false); // Stop loading
                });
            }

        } catch (error: any) {
            console.error("Order Process Failed", error);
            Alert.alert("Error", error.message || "Something went wrong");
            setPlacingOrder(false); // Stop loading on catch
        }
        // Note: Don't put setPlacingOrder(false) in a 'finally' block for the main try-catch, 
        // because for COD/Success we redirect, and unmounting component while setting state can cause warnings.
    };
    if (loading) return <ActivityIndicator style={styles.center} size="large" color="#FF6B35" />;
    if (!cart) return <View style={styles.center}><Text>Cart Error</Text></View>;

    // 💰 Calculate Finals
    const itemTotal = cart.totalPrice || cart.total || 0;
    const grandTotal = itemTotal + DELIVERY_FEE;

    return (
        <View style={styles.container}>
            <AppHeader title="Checkout" showBack={true} />
            <ScrollView style={styles.scrollView}>

                {/* 1. DELIVERY ADDRESS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Delivery Address</Text>
                    <View style={styles.addressCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name="location" size={24} color="#FF6B35" />
                            <View style={{ flex: 1 }}>
                                {selectedAddress ? (
                                    <>
                                        <Text style={{ fontWeight: '700', fontSize: 14 }}>{selectedAddress.type}</Text>
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

                {/* 2. ITEM SUMMARY */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Order Summary</Text>
                    <View style={styles.card}>
                        {cart.items.map((item: any) => (
                            <View key={item.productId} style={styles.itemRow}>
                                <Text style={styles.qtyBadge}>{item.quantity}x</Text>
                                <Text style={{ flex: 1 }} numberOfLines={1}>{item.name}</Text>
                                <Text style={{ fontWeight: '600' }}>₹{item.price * item.quantity}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 3. BILL DETAILS (NEW SECTION) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Bill Details</Text>
                    <View style={styles.card}>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Item Total</Text>
                            <Text style={styles.billValue}>₹{itemTotal}</Text>
                        </View>
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Delivery Fee</Text>
                            <Text style={styles.billValue}>₹{DELIVERY_FEE}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.billRow}>
                            <Text style={styles.totalLabel}>To Pay</Text>
                            <Text style={styles.totalValue}>₹{grandTotal}</Text>
                        </View>
                    </View>
                </View>

                {/* 4. PAYMENT METHOD */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment</Text>
                    <TouchableOpacity
                        style={[styles.paymentOpt, paymentMethod === 'COD' && styles.activePay]}
                        onPress={() => setPaymentMethod('COD')}>
                        <Ionicons name="cash-outline" size={20} color={paymentMethod === 'COD' ? "#FF6B35" : "#000"} />
                        <Text style={[styles.payText, paymentMethod === 'COD' && { color: '#FF6B35' }]}>Cash on Delivery</Text>
                    </TouchableOpacity>

                    {/* Add Online Payment Option here later if needed */}

                    <TouchableOpacity
                        style={[styles.paymentOpt, paymentMethod === 'ONLINE' && styles.activePay]}
                        onPress={() => setPaymentMethod('ONLINE')}>
                        <Ionicons name="card-outline" size={20} color={paymentMethod === 'ONLINE' ? "#FF6B35" : "#000"} />
                        <View>
                            <Text style={[styles.payText, paymentMethod === 'ONLINE' && { color: '#FF6B35' }]}>Pay Online</Text>
                            <Text style={styles.subText}>UPI, Card, Netbanking</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* 4. PAYMENT METHOD SELECTION */}



                <View style={{ height: 100 }} />
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.footer}>
                <View>
                    <Text style={{ color: '#666', fontSize: 12 }}>Total</Text>
                    <Text style={styles.footerTotal}>₹{grandTotal}</Text>
                </View>
                <TouchableOpacity style={styles.placeBtn} onPress={handlePlaceOrder} disabled={placingOrder}>
                    {placingOrder ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.placeText}>Place Order</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* ADDRESS MODAL (Keep your existing Modal code here) */}
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
                                <TouchableOpacity style={styles.gpsBtn} onPress={handleUseCurrentLocation}>
                                    {locationLoading ? <ActivityIndicator color="#FF6B35" /> : <Ionicons name="navigate" size={18} color="#FF6B35" />}
                                    <Text style={styles.gpsText}>Use Current Location</Text>
                                </TouchableOpacity>

                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    {['Home', 'Work', 'Other'].map(type => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[styles.typeChip, newAddress.type === type && styles.activeChip]}
                                            onPress={() => setNewAddress({ ...newAddress, type: type })}
                                        >
                                            <Text style={[styles.chipText, newAddress.type === type && { color: '#FFF' }]}>{type}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

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
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <TextInput
                                        placeholder="City"
                                        style={[styles.input, { flex: 1 }]}
                                        value={newAddress.city}
                                        onChangeText={t => setNewAddress({ ...newAddress, city: t })}
                                    />
                                    <TextInput
                                        placeholder="State"
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
                                </View>

                                <TouchableOpacity style={styles.saveAddrBtn} onPress={handleSaveAddress}>
                                    <Text style={styles.saveAddrText}>Save Address</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // === ADDRESS LIST ===
                            <View>
                                <TouchableOpacity style={styles.addNewBtn} onPress={() => setIsAddingNew(true)}>
                                    <Ionicons name="add" size={20} color="#FF6B35" />
                                    <Text style={{ color: '#FF6B35', fontWeight: '700' }}>Add New Address</Text>
                                </TouchableOpacity>

                                {addresses.map((addr) => (
                                    <TouchableOpacity
                                        key={addr.id || addr._id}
                                        style={[styles.addrOption, (selectedAddress?.id || selectedAddress?._id) === (addr.id || addr._id) && styles.selectedOption]}
                                        onPress={() => { setSelectedAddress(addr); setShowAddressModal(false); }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                                <Text style={styles.typeChip}>{addr.type}</Text>
                                                {addr.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
                                            </View>
                                            <Text style={styles.addrText}>
                                                {addr.addressLine1}, {addr.city}, {addr.zipCode}
                                            </Text>
                                        </View>
                                        {(selectedAddress?.id || selectedAddress?._id) === (addr.id || addr._id) && (
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
    scrollView: { flex: 1, padding: 16 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, color: '#333' },

    // Cards
    card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16 },
    addressCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12 },

    // Address UI
    addrText: { color: '#555', fontSize: 14, lineHeight: 20 },
    changeBtn: { color: '#FF6B35', fontWeight: '700', fontSize: 12 },

    // Item UI
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    qtyBadge: { backgroundColor: '#FFF0E6', color: '#FF6B35', paddingHorizontal: 6, borderRadius: 4, marginRight: 8, fontSize: 12, fontWeight: '700' },

    // Bill UI
    billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    billLabel: { color: '#666', fontSize: 14 },
    billValue: { color: '#333', fontSize: 14, fontWeight: '600' },
    divider: { height: 1, backgroundColor: '#EEE', marginVertical: 8 },
    totalLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
    totalValue: { fontSize: 16, fontWeight: '700', color: '#2ECC71' },

    // Payment UI
    paymentOpt: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EEE' },
    activePay: { borderColor: '#FF6B35', backgroundColor: '#FFF5F0' },
    payText: { marginLeft: 10, fontWeight: '600' },
    subText: { fontSize: 12, color: '#999', marginTop: 4 },

    // Footer
    footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 30 },
    footerTotal: { fontSize: 20, fontWeight: '700' },
    placeBtn: { backgroundColor: '#2E7D32', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10 },
    placeText: { color: '#FFF', fontWeight: '700' },

    // Address Modal (Copy from your existing code)
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