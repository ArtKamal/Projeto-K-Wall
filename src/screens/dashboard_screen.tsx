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
import DispositivoScreen from './dispositivo_screen';

// Tipagem das rotas Stack e Tab
type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined; // Dashboard agora é o Tab Navigator
    Dispositivo: undefined; // Adicione a rota para a tela de cadastro de dispositivo
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

function ApiScreen() {
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Cabeçalho da Página */}
                <View style={styles.apiHeader}>
                    <Text style={styles.pageTitle}>Dados da API</Text>
                    <Text style={styles.subtitle}>Monitoramento de endpoints e integrações</Text>
                </View>

                {/* Card de API 1 */}
                <TouchableOpacity style={styles.apiCard} activeOpacity={0.7}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="server-outline" size={22} color="#47d406" />
                    </View>
                    <View style={styles.apiInfo}>
                        <Text style={styles.apiEndpoint}>GET /api/v1/devices</Text>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, { backgroundColor: '#47d406' }]} />
                            <Text style={styles.apiStatus}>Status: 200 OK</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>

                {/* Card de API 2 */}
                <TouchableOpacity style={styles.apiCard} activeOpacity={0.7}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="shield-checkmark-outline" size={22} color="#47d406" />
                    </View>
                    <View style={styles.apiInfo}>
                        <Text style={styles.apiEndpoint}>GET /api/v1/firewall/rules</Text>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, { backgroundColor: '#47d406' }]} />
                            <Text style={styles.apiStatus}>Status: 200 OK</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>

                {/* Card de API 3 (Exemplo de Erro) */}
                <TouchableOpacity style={styles.apiCard} activeOpacity={0.7}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="warning-outline" size={22} color="#EF4444" />
                    </View>
                    <View style={styles.apiInfo}>
                        <Text style={styles.apiEndpoint}>POST /api/v1/auth/token</Text>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
                            <Text style={[styles.apiStatus, { color: '#EF4444' }]}>Status: 401 Unauthorized</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

function PerfilScreen({ navigation }: any) {
    return (
        <View style={styles.centeredContainer}>
            <Ionicons name="person-circle-outline" size={60} color="#47d406" />
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
                tabBarActiveTintColor: '#47d406', // Verde principal
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#1F2937',
                    borderTopColor: '#374151',
                    minHeight: 70,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Dispositivos" component={DispositivoScreen as any} options={{ tabBarLabel: 'Dispositivos' }} />
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
    apiHeader: {
        marginBottom: 24,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40, // Ajuste esse valor dependendo de ter cabeçalho global ou não
        paddingBottom: 40,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: '#9CA3AF',
    },
    apiCard: {
        backgroundColor: '#1F2937', // Fundo do card
        borderWidth: 1,
        borderColor: '#374151', // Borda
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: '#111827', // Fundo do ícone mais escuro
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        borderWidth: 1,
        borderColor: '#374151',
    },
    apiInfo: {
        flex: 1,
    },
    apiEndpoint: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF', // Texto branco para contraste
        marginBottom: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    apiStatus: {
        fontSize: 13,
        color: '#47d406', // Verde do projeto (sucesso)
        fontWeight: '600',
    },
});