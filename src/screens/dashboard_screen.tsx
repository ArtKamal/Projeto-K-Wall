import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#111827"
            />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Cabeçalho */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Image
                            style={styles.logo}
                            source={require('../../assets/images/logoCyber.png')}
                        />

                        <View>
                            <Text style={styles.greeting}>
                                Olá, usuário!
                            </Text>

                            <Text style={styles.headerSubtitle}>
                                Bem-vindo ao K-Wall
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.notificationButton}
                        activeOpacity={0.7}
                        onPress={() => {
                            console.log('Notificações');
                        }}
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={22}
                            color="#E5E7EB"
                        />

                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* Status de segurança */}
                

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    activeOpacity={0.7}
                    onPress={() => {
                        navigation.replace('Login');
                    }}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={20}
                        color="#D1D5DB"
                    />

                    <Text style={styles.logoutText}>
                        Sair da conta
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <Text style={styles.footer}>
                © 2026 K-Wall Cyber Security
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },

    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 100,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28,
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    logo: {
        width: 58,
        height: 58,
        marginRight: 12,
    },

    greeting: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    headerSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: '#9CA3AF',
    },

    notificationButton: {
        width: 46,
        height: 46,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#374151',
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
    },

    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 11,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },

    securityCard: {
        minHeight: 92,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#374151',
        backgroundColor: '#1F2937',
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
    },

    securityIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#374151',
    },

    securityInfo: {
        flex: 1,
        marginLeft: 14,
    },

    securityTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    securitySubtitle: {
        marginTop: 5,
        fontSize: 13,
        color: '#9CA3AF',
    },

    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#34D399',
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    sectionDate: {
        fontSize: 13,
        color: '#9CA3AF',
    },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 28,
    },

    statCard: {
        width: '48%',
        minHeight: 135,
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
    },

    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },

    statValue: {
        fontSize: 25,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    statLabel: {
        marginTop: 3,
        fontSize: 13,
        color: '#9CA3AF',
    },

    actionCard: {
        minHeight: 78,
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },

    actionIcon: {
        width: 46,
        height: 46,
        borderRadius: 11,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

    actionInfo: {
        flex: 1,
        marginLeft: 14,
        marginRight: 8,
    },

    actionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    actionSubtitle: {
        marginTop: 4,
        fontSize: 12,
        lineHeight: 17,
        color: '#9CA3AF',
    },

    activityCard: {
        minHeight: 70,
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },

    activityIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#064E3B',
        alignItems: 'center',
        justifyContent: 'center',
    },

    activityInfo: {
        flex: 1,
        marginLeft: 12,
    },

    activityTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    activitySubtitle: {
        marginTop: 3,
        fontSize: 12,
        color: '#9CA3AF',
    },

    activityTime: {
        fontSize: 12,
        color: '#6B7280',
    },

    logoutButton: {
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 25,
    },

    logoutText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#D1D5DB',
    },

    footer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        fontSize: 11,
        color: '#6B7280',
    },
});