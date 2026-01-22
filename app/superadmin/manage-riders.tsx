import AppHeader from '@/components/profileHeader';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { api } from "../lib/apiService"; // Aapka API Wrapper

export default function ManageRiders() {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // Form State
    const [form, setForm] = useState({
        fullName: '',
        mobile: '',
        password: '',
        vehicleType: 'Bike',
        vehicleNumber: '',
        licenseNumber: ''
    });

    // 1️⃣ Fetch Existing Riders
    const fetchRiders = async () => {
        setLoading(true);
        try {
            // Backend API: /allapiRoute/admin/delivery/get-riders.js (Aapko banana padega list fetch krne ke liye)
            const res: any = await api('/admin/delivery/get-riders');
            if (res.success) setRiders(res.riders);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRiders(); }, []);

    // 2️⃣ Create New Rider Handler
    const handleCreateRider = async () => {
        if (!form.fullName || !form.mobile || !form.password) {
            Alert.alert("Error", "Name, Mobile and Password are required");
            return;
        }

        try {
            const res: any = await api('/admin/delivery/create-rider', 'POST', form);

            if (res.success) {
                Alert.alert("Success", "Rider Onboarded Successfully!");
                setModalVisible(false);
                setForm({ fullName: '', mobile: '', password: '', vehicleType: 'Bike', vehicleNumber: '', licenseNumber: '' }); // Reset Form
                fetchRiders(); // List refresh karein
            } else {
                Alert.alert("Error", res.message);
            }
        } catch (e: any) {
            Alert.alert("Error", e.message || "Failed to create rider");
        }
    };

    // Render Rider List Item
    const renderRider = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: item.RiderProfile?.isOnline ? '#2ECC71' : '#DDD' }]}>
                    <Ionicons name="person" size={20} color="#FFF" />
                </View>
                <View>
                    <Text style={styles.name}>{item.fullName}</Text>
                    <Text style={styles.details}>{item.mobile} • {item.RiderProfile?.vehicleNumber}</Text>
                </View>
            </View>
            <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                    {item.RiderProfile?.isOnline ? 'ONLINE' : 'OFFLINE'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>

            <AppHeader title="Manage Riders" showBack={true} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Delivery Partners</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add" size={24} color="#FFF" />
                    <Text style={styles.addBtnText}>Add New</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            {loading ? <ActivityIndicator color="#FF6B35" style={{ marginTop: 50 }} /> : (
                <FlatList
                    data={riders}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={renderRider}
                    contentContainerStyle={{ padding: 20 }}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No riders found.</Text>}
                />
            )}

            {/* ADD RIDER MODAL */}
            <Modal visible={modalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Onboard New Rider</Text>

                    <TextInput
                        placeholder="Full Name"
                        style={styles.input}
                        value={form.fullName}
                        onChangeText={(t) => setForm({ ...form, fullName: t })}
                    />
                    <TextInput
                        placeholder="Mobile Number"
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={form.mobile}
                        onChangeText={(t) => setForm({ ...form, mobile: t })}
                    />
                    <TextInput
                        placeholder="Login Password"
                        style={styles.input}
                        value={form.password}
                        onChangeText={(t) => setForm({ ...form, password: t })}
                    />

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TextInput
                            placeholder="Vehicle Type (Bike/Scooter)"
                            style={[styles.input, { flex: 1 }]}
                            value={form.vehicleType}
                            onChangeText={(t) => setForm({ ...form, vehicleType: t })}
                        />
                        <TextInput
                            placeholder="Vehicle Number"
                            style={[styles.input, { flex: 1 }]}
                            value={form.vehicleNumber}
                            onChangeText={(t) => setForm({ ...form, vehicleNumber: t })}
                        />
                    </View>

                    <TextInput
                        placeholder="Driving License Number"
                        style={styles.input}
                        value={form.licenseNumber}
                        onChangeText={(t) => setForm({ ...form, licenseNumber: t })}
                    />

                    <TouchableOpacity style={styles.submitBtn} onPress={handleCreateRider}>
                        <Text style={styles.submitText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20, alignItems: 'center' }}>
                        <Text style={{ color: 'red' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5' },
    header: { padding: 20, paddingTop: 50, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 22, fontWeight: 'bold' },
    addBtn: { flexDirection: 'row', backgroundColor: '#FF6B35', padding: 8, borderRadius: 8, alignItems: 'center' },
    addBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },

    card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    name: { fontWeight: 'bold', fontSize: 16 },
    details: { color: '#888', fontSize: 12 },
    statusBadge: { backgroundColor: '#F0F0F0', padding: 5, borderRadius: 5 },
    statusText: { fontSize: 10, fontWeight: 'bold' },

    // Modal
    modalContainer: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#FFF' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#EEE', padding: 15, borderRadius: 10, marginBottom: 15, backgroundColor: '#F9F9F9' },
    submitBtn: { backgroundColor: '#FF6B35', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    submitText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});