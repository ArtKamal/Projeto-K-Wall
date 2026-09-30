import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Platform,
    ActivityIndicator
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DispositiveService } from '../services/dispositiveService';
import { DispositiveModel } from '../models/DispositiveModel';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
    Dispositivos: undefined;
    Dispositivo: undefined;
};

type Props = NativeStackScreenProps<
    RootStackParamList,
    'Dispositivos'
>;


export default function DispositivosScreen({ navigation }: Props) {

    const [dispositivos, setDispositivos] = useState<DispositiveModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const carregarDispositivos = async () => {
        try {
            setLoading(true);
            const dados = await DispositiveService.listarTodas();
            setDispositivos(dados);
        } catch (error) {
            console.error('Erro ao carregar dispositivos:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregarDispositivos();
        }, [])
    );

    const getCriticidadeStyle = (nivel: DispositiveModel['nivelCritico']) => {

        switch (nivel) {
            case 'Alto':
                return styles.criticalHigh;

            case 'Médio':
                return styles.criticalMedium;

            case 'Baixo':
                return styles.criticalLow;
        }
    };

    const renderDispositivo = ({ item }: { item: DispositiveModel }) => {

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
            >

                <View style={styles.cardHeader}>

                    <View style={styles.deviceIcon}>
                        <Ionicons
                            name="hardware-chip-outline"
                            size={24}
                            color="#47d406"
                        />
                    </View>

                    <View style={styles.deviceHeaderInfo}>
                        <Text style={styles.deviceName}>
                            {item.nome || 'N/A'}
                        </Text>

                        <Text style={styles.deviceType}>
                            {item.tipo || 'N/A'}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.statusIndicator,
                            item.status === 'Ativo'
                                ? styles.statusActive
                                : styles.statusInactive
                        ]}
                    />

                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>

                    <View style={styles.infoItem}>
                        <Ionicons
                            name="globe-outline"
                            size={17}
                            color="#9CA3AF"
                        />

                        <View>
                            <Text style={styles.infoLabel}>
                                IP / Hostname
                            </Text>

                            <Text style={styles.infoValue}>
                                {item.hostname || 'N/A'}
                            </Text>
                        </View>
                    </View>

                </View>

                <View style={styles.cardFooter}>

                    <View
                        style={[
                            styles.criticalBadge,
                            getCriticidadeStyle(item.nivelCritico)
                        ]}
                    >
                        <Ionicons
                            name="alert-circle-outline"
                            size={14}
                            color="#FFFFFF"
                        />

                        <Text style={styles.badgeText}>
                            {item.nivelCritico || 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.statusContainer}>

                        <Text style={styles.statusLabel}>
                            Status:
                        </Text>

                        <Text
                            style={[
                                styles.statusText,
                                item.status === 'Ativo'
                                    ? styles.activeText
                                    : styles.inactiveText
                            ]}
                        >
                            {item.status || 'N/A'}
                        </Text>

                    </View>

                </View>

            </TouchableOpacity>
        );
    };
    if(loading) {
        return (
            <View style={styles.loadingContainer}>

                <ActivityIndicator
                    size="large"
                    color="#47d406"
                />

                <Text style={styles.loadingText}>
                    Carregando dispositivos...
                </Text>

            </View>
        );
    }
    return (
        <View style={styles.container}>

            <StatusBar
                barStyle="light-content"
                backgroundColor="#111827"
            />

            {/* Cabeçalho */}
            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                <View>
                    <Text style={styles.headerTitle}>
                        Dispositivos
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Ativos monitorados
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Dispositivo')}
                >
                    <Ionicons
                        name="add"
                        size={25}
                        color="#111827"
                    />
                </TouchableOpacity>

            </View>

            {/* Quantidade de dispositivos */}
            <View style={styles.summaryContainer}>

                <Text style={styles.summaryTitle}>
                    Dispositivos cadastrados
                </Text>

                <View style={styles.counter}>
                    <Text style={styles.counterText}>
                        {dispositivos.length}
                    </Text>
                </View>

            </View>

            {/* Lista */}
            <FlatList
                data={dispositivos}
                keyExtractor={(item) => item.id?.toString() ?? ''}
                renderItem={renderDispositivo}
                contentContainerStyle={
                    dispositivos.length === 0
                        ? styles.emptyList
                        : styles.list
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>

                        <Ionicons
                            name="hardware-chip-outline"
                            size={60}
                            color="#4B5563"
                        />

                        <Text style={styles.emptyTitle}>
                            Nenhum dispositivo
                        </Text>

                        <Text style={styles.emptyText}>
                            Cadastre seu primeiro dispositivo para começar o monitoramento.
                        </Text>

                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate('Dispositivo')}
                        >
                            <Ionicons
                                name="add"
                                size={20}
                                color="#111827"
                            />

                            <Text style={styles.emptyButtonText}>
                                Novo dispositivo
                            </Text>
                        </TouchableOpacity>

                    </View>
                }
            />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#111827'
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 20 : 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937'
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#374151'
    },

    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    headerSubtitle: {
        color: '#9CA3AF',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 2
    },

    addButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#47d406',
        alignItems: 'center',
        justifyContent: 'center'
    },

    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16
    },

    summaryTitle: {
        color: '#D1D5DB',
        fontSize: 14,
        fontWeight: '600'
    },

    counter: {
        backgroundColor: '#1F2937',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20
    },

    counterText: {
        color: '#47d406',
        fontWeight: 'bold'
    },

    list: {
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 10,
        color: '#D1D5DB',
        fontSize: 14
    },
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#374151'
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    deviceIcon: {
        width: 45,
        height: 45,
        borderRadius: 10,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    },

    deviceHeaderInfo: {
        flex: 1
    },

    deviceName: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },

    deviceType: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 3
    },

    statusIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5
    },

    statusActive: {
        backgroundColor: '#47d406'
    },

    statusInactive: {
        backgroundColor: '#EF4444'
    },

    divider: {
        height: 1,
        backgroundColor: '#374151',
        marginVertical: 14
    },

    infoRow: {
        marginBottom: 14
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },

    infoLabel: {
        color: '#6B7280',
        fontSize: 11
    },

    infoValue: {
        color: '#D1D5DB',
        fontSize: 14,
        marginTop: 2
    },

    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    criticalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 5
    },

    criticalHigh: {
        backgroundColor: '#DC2626'
    },

    criticalMedium: {
        backgroundColor: '#D97706'
    },

    criticalLow: {
        backgroundColor: '#16A34A'
    },

    badgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: 'bold'
    },

    statusContainer: {
        flexDirection: 'row',
        gap: 5
    },

    statusLabel: {
        color: '#9CA3AF',
        fontSize: 12
    },

    statusText: {
        fontSize: 12,
        fontWeight: 'bold'
    },

    activeText: {
        color: '#47d406'
    },

    inactiveText: {
        color: '#EF4444'
    },

    emptyList: {
        flexGrow: 1,
        justifyContent: 'center'
    },

    emptyContainer: {
        alignItems: 'center',
        paddingHorizontal: 40
    },

    emptyTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 18
    },

    emptyText: {
        color: '#9CA3AF',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8
    },

    emptyButton: {
        flexDirection: 'row',
        backgroundColor: '#47d406',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        gap: 7,
        marginTop: 20
    },

    emptyButtonText: {
        color: '#111827',
        fontWeight: 'bold'
    }
});