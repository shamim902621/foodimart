import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AppHeaderProps {
    title?: string;
    showBack?: boolean;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    onRightPress?: () => void;
    locationText?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    showBack = false,
    leftIcon,
    rightIcon,
    onRightPress,
    locationText
}) => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.container}>

                {/* Left Side: Back Button or Location */}
                <View style={styles.leftContainer}>
                    {showBack ? (
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.locationContainer}>
                            <Ionicons name="location-sharp" size={20} color="#FF6B35" />
                            <View>
                                <Text style={styles.locationLabel}>Delivering to</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.locationText}>{locationText || "Select Location"}</Text>
                                    <Ionicons name="chevron-down" size={16} color="#333" />
                                </View>
                            </View>
                        </View>
                    )}
                </View>

                {/* Center: Title (Optional) */}
                {title && !locationText && (
                    <Text style={styles.title}>{title}</Text>
                )}

                {/* Right Side: Profile or Custom Icon */}
                <View style={styles.rightContainer}>
                    {rightIcon && (
                        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
                            <Ionicons name={rightIcon} size={24} color="#333" />
                        </TouchableOpacity>
                    )}
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Fix for Android Status Bar overlap
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationLabel: {
        fontSize: 10,
        color: '#666',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    locationText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginRight: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    iconButton: {
        padding: 8,
    },
});

export default AppHeader;