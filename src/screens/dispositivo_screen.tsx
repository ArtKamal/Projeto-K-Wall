import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Substitua pelo seu tipo de rotas real, se estiver em outro arquivo
type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
    Dispositivo: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Dispositivo'>;

export default function DispositivoScreen({ navigation }: Props) {
    const [nome, setNome] = useState('');
    const [ip, setIp] = useState('');
    const [tipo, setTipo] = useState('');

    const handleSalvar = () => {
        console.log('Dispositivo salvo:', { nome, ip, tipo });
        // Aqui vai a lógica de API futuramente
        navigation.goBack(); // Volta para a tela anterior
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor="#111827" />

            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Dispositivo</Text>
                <View style={styles.placeholder} /> {/* Para centralizar o título */}
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.subtitle}>
                    Insira os dados do ativo para monitoramento no K-Wall.
                </Text>

                {/* Formulário */}
                <View style={styles.form}>

                    {/* Campo Nome */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome do Ativo</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="hardware-chip-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Servidor DB Principal"
                                placeholderTextColor="#6B7280"
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>
                    </View>

                    {/* Campo IP */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Endereço IPv4 / Hostname</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="globe-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="192.168.0.100"
                                placeholderTextColor="#6B7280"
                                keyboardType="numeric"
                                value={ip}
                                onChangeText={setIp}
                            />
                        </View>
                    </View>

                    {/* Campo Tipo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tipo de Dispositivo</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="layers-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Roteador, Firewall, Câmera"
                                placeholderTextColor="#6B7280"
                                value={tipo}
                                onChangeText={setTipo}
                            />
                        </View>
                    </View>

                </View>

                {/* Botão Salvar */}
                <TouchableOpacity
                    style={styles.submitButton}
                    activeOpacity={0.8}
                    onPress={handleSalvar}
                >
                    <Ionicons name="shield-checkmark-outline" size={20} color="#111827" />
                    <Text style={styles.submitButtonText}>Cadastrar Dispositivo</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 20 : 50,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#374151',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    placeholder: {
        width: 40,
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 24,
        lineHeight: 20,
    },
    form: {
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#D1D5DB',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 12,
        height: 52,
        paddingHorizontal: 14,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
        height: '100%',
    },
    submitButton: {
        backgroundColor: '#47d406', // Verde principal
        height: 54,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#47d406',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});