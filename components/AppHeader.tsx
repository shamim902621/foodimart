import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// ✅ 1. Interface Fixed (Subtitle & Left Props Added)
interface AppHeaderProps {
    title?: string;
    subtitle?: string; // 👈 Fixed Error 1

    // --- Left Side Control ---
    showBack?: boolean;
    leftIcon?: keyof typeof Ionicons.glyphMap; // 👈 Fixed Error 2
    onLeftPress?: () => void; // 👈 Fixed Error 2

    // --- Right Side Control ---
    rightIcon?: keyof typeof Ionicons.glyphMap;
    rightText?: string;
    onRightPress?: () => void;
    nextRoute?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    subtitle,
    showBack = true,
    leftIcon,
    onLeftPress,
    rightIcon,
    rightText,
    onRightPress,
    nextRoute
}) => {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    // 🛡️ Safe Back Navigation
    const handleSafeBack = useCallback(() => {
        if (isNavigating) return;
        setIsNavigating(true);
        setTimeout(() => setIsNavigating(false), 500);

        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    }, [isNavigating, router]);

    // 🚀 Right Side Action
    const handleRightAction = useCallback(() => {
        if (isNavigating) return;
        setIsNavigating(true);
        setTimeout(() => setIsNavigating(false), 500);

        if (onRightPress) {
            onRightPress();
            return;
        }

        if (nextRoute) {
            router.push(nextRoute as any);
        }
    }, [isNavigating, onRightPress, nextRoute, router]);

    // 👈 Left Side Action
    const handleLeftAction = useCallback(() => {
        if (onLeftPress) {
            onLeftPress();
        }
    }, [onLeftPress]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.container}>

                {/* --- LEFT CONTAINER --- */}
                <View style={styles.leftContainer}>
                    {showBack ? (
                        // Case A: Show Back Arrow
                        <TouchableOpacity
                            onPress={handleSafeBack}
                            style={styles.iconButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                    ) : leftIcon ? (
                        // Case B: Show Custom Icon (Menu, etc.)
                        <TouchableOpacity
                            onPress={handleLeftAction}
                            style={styles.iconButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name={leftIcon} size={24} color="#333" />
                        </TouchableOpacity>
                    ) : (
                        // Case C: Show Nothing (Blank) - ✅ Map Icon Fixed
                        <View style={{ width: 24 }} />
                    )}
                </View>

                {/* --- CENTER (TITLE & SUBTITLE) --- */}
                <View style={styles.centerContainer}>
                    {title && (
                        <View style={styles.titleWrapper}>
                            <Text style={styles.title} numberOfLines={1}>
                                {title}
                            </Text>
                            {subtitle ? (
                                <Text style={styles.subtitle} numberOfLines={1}>
                                    {subtitle}
                                </Text>
                            ) : null}
                        </View>
                    )}
                </View>

                {/* --- RIGHT CONTAINER --- */}
                <View style={styles.rightContainer}>
                    {(rightIcon || rightText) ? (
                        <TouchableOpacity
                            onPress={handleRightAction}
                            style={[styles.iconButton, rightText ? styles.textBtn : {}]}
                        >
                            {rightText ? (
                                <Text style={styles.rightTextLabel}>{rightText}</Text>
                            ) : (
                                <Ionicons name={rightIcon} size={24} color="#328a0dff" />
                            )}
                        </TouchableOpacity>
                    ) : (
                        // Balance layout if right is empty
                        <View style={{ width: 24 }} />
                    )}
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        zIndex: 100,
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    leftContainer: {
        width: 50,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        marginTop: 1,
        fontWeight: '500',
    },
    rightContainer: {
        width: 50,
        alignItems: 'flex-end',
    },
    iconButton: {
        padding: 4,
    },
    textBtn: {
        backgroundColor: '#f0f9eb',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    rightTextLabel: {
        color: '#328a0dff',
        fontWeight: '700',
        fontSize: 13,
    }
});

export default AppHeader;