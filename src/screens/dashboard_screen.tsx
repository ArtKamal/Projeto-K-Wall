import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

// Tipagem das rotas Stack e Tab
type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined; // Dashboard agora é o Tab Navigator
};

type TabParamList = {
    Home: undefined;
    Dispositivos: undefined;
    API: undefined;
    Perfil: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const Tab = createBottomTabNavigator<TabParamList>();

// --- ABA HOME (Seu código original modificado para ser uma aba) ---
function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#111827" />

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
                            <Text style={styles.greeting}>Olá, usuário!</Text>
                            <Text style={styles.headerSubtitle}>Bem-vindo ao K-Wall</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.notificationButton}
                        activeOpacity={0.7}
                        onPress={() => console.log('Notificações')}
                    >
                        <Ionicons name="notifications-outline" size={22} color="#E5E7EB" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* Adicione os Cards de Status e Ações aqui */}

            </ScrollView>
        </View>
    );
}

// --- TELAS PLACEHOLDER PARA AS OUTRAS ABAS ---
function DispositivosScreen() {
    return (
        <View style={styles.centeredContainer}>
            <Ionicons name="hardware-chip-outline" size={60} color="#34D399" />
            <Text style={styles.placeholderText}>Meus Dispositivos</Text>
        </View>
    );
}

function ApiScreen() {
    return (
        <View style={styles.centeredContainer}>
            <Ionicons name="code-slash-outline" size={60} color="#34D399" />
            <Text style={styles.placeholderText}>Gerenciamento de API</Text>
        </View>
    );
}

function PerfilScreen({ navigation }: any) {
    return (
        <View style={styles.centeredContainer}>
            <Ionicons name="person-circle-outline" size={60} color="#34D399" />
            <Text style={styles.placeholderText}>Meu Perfil</Text>
            
            <TouchableOpacity
                style={styles.logoutButton}
                activeOpacity={0.7}
                onPress={() => navigation.getParent()?.replace('Login')} // Volta pro Stack
            >
                <Ionicons name="log-out-outline" size={20} color="#D1D5DB" />
                <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>

            <Text style={styles.footer}>© 2026 K-Wall Cyber Security</Text>
        </View>
    );
}

// --- TAB NAVIGATOR (Exportação Principal) ---
export default function DashboardScreen({ navigation }: Props) {
    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: any }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Dispositivos') {
                        iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
                    } else if (route.name === 'API') {
                        iconName = focused ? 'code-slash' : 'code-slash-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#34D399', // Verde principal
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#1F2937',
                    borderTopColor: '#374151',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Dispositivos" component={DispositivosScreen} />
            <Tab.Screen name="API" component={ApiScreen} />
            <Tab.Screen name="Perfil" component={PerfilScreen} />
        </Tab.Navigator>
    );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    centeredContainer: {
        flex: 1,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 20, // Reduzido pois agora há a barra de navegação embaixo
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
    logoutButton: {
        height: 50,
        width: '80%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#374151',
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 40,
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