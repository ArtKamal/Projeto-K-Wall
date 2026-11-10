import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Switch
} from 'react-native';

import type { RedeModel } from '../models/RedeModel';
import { RedeService } from '../services/redeService';

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
    Redes: undefined;
    Rede: { redeParaEditar?: RedeModel } | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Rede'>;

type RedeFormData = Omit<RedeModel, 'id'>;

export default function RedeScreen({ route, navigation }: Props) {
    const redeParaEditar = route.params?.redeParaEditar;
    const isEdicao = !!redeParaEditar;

    const [nome, setNome] = useState('');
    const [enderecoCIDR, setEnderecoCIDR] = useState('');
    const [gateway, setGateway] = useState('');
    const [dns, setDns] = useState('');
    const [vlan, setVlan] = useState('');
    const [descricao, setDescricao] = useState('');
    const [ativo, setAtivo] = useState<boolean>(true);

    const [nomeError, setNomeError] = useState('');
    const [cidrError, setCidrError] = useState('');
    const [gatewayError, setGatewayError] = useState('');
    const [dnsError, setDnsError] = useState('');
    const [vlanError, setVlanError] = useState('');
    const [mensagemSucesso, setMensagemSucesso] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!redeParaEditar) return;

        setNome(redeParaEditar.nome ?? '');
        setEnderecoCIDR(redeParaEditar.enderecoCIDR ?? '');
        setGateway(redeParaEditar.gateway ?? '');
        setDns(redeParaEditar.dns?.join(', ') ?? '');
        setVlan(redeParaEditar.vlan !== undefined ? String(redeParaEditar.vlan) : '');
        setDescricao(redeParaEditar.descricao ?? '');
        setAtivo(redeParaEditar.ativo ?? true);
    }, [redeParaEditar]);

    const isValidIPv4 = (value: string): boolean => {
        const parts = value.trim().split('.');
        if (parts.length !== 4) return false;

        return parts.every((part) => {
            if (!/^\d{1,3}$/.test(part)) return false;
            const number = Number(part);
            return number >= 0 && number <= 255;
        });
    };

    const isValidCIDR = (value: string): boolean => {
        const parts = value.trim().split('/');
        if (parts.length !== 2 || !isValidIPv4(parts[0])) return false;
        if (!/^\d{1,2}$/.test(parts[1])) return false;

        const prefix = Number(parts[1]);
        return prefix >= 0 && prefix <= 32;
    };

    const validarCampos = (): boolean => {
        let valido = true;

        if (!nome.trim()) {
            setNomeError('Informe o nome da rede.');
            valido = false;
        } else {
            setNomeError('');
        }

        if (!enderecoCIDR.trim()) {
            setCidrError('Informe o endereço da rede em formato CIDR.');
            valido = false;
        } else if (!isValidCIDR(enderecoCIDR)) {
            setCidrError('Use um CIDR válido, por exemplo: 192.168.1.0/24.');
            valido = false;
        } else {
            setCidrError('');
        }

        if (gateway.trim() && !isValidIPv4(gateway)) {
            setGatewayError('Informe um endereço IPv4 válido.');
            valido = false;
        } else {
            setGatewayError('');
        }

        const servidoresDns = dns
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        if (servidoresDns.some((item) => !isValidIPv4(item))) {
            setDnsError('Informe IPv4 válidos, separados por vírgula.');
            valido = false;
        } else {
            setDnsError('');
        }

        if (vlan.trim()) {
            const numeroVlan = Number(vlan);
            if (!/^\d+$/.test(vlan.trim()) || numeroVlan < 1 || numeroVlan > 4094) {
                setVlanError('A VLAN deve ser um número entre 1 e 4094.');
                valido = false;
            } else {
                setVlanError('');
            }
        } else {
            setVlanError('');
        }

        return valido;
    };

    const handleSalvar = async () => {
        setMensagemSucesso('');
        if (!validarCampos()) return;

        const dadosRede: RedeFormData = {
            nome: nome.trim(),
            enderecoCIDR: enderecoCIDR.trim(),
            gateway: gateway.trim() || undefined,
            dns: dns.split(',').map((item) => item.trim()).filter(Boolean),
            vlan: vlan.trim() ? Number(vlan) : undefined,
            descricao: descricao.trim() || undefined,
            ativo
        };

        try {
            setSaving(true);

            if (isEdicao) {
                const id = redeParaEditar?.id;
                if (!id) {
                    throw new Error('Não foi possível identificar a rede para edição.');
                }
                await RedeService.atualizar(String(id), dadosRede);
                setMensagemSucesso('Rede atualizada com sucesso!');
            } else {
                await RedeService.criar(dadosRede);
                setMensagemSucesso('Rede cadastrada com sucesso!');
                setNome('');
                setEnderecoCIDR('');
                setGateway('');
                setDns('');
                setVlan('');
                setDescricao('');
                setAtivo(true);
            }
        } catch (error) {
            console.error('Erro ao salvar rede:', error);
            setMensagemSucesso('');
            const mensagem = error instanceof Error ? error.message : 'Não foi possível salvar a rede.';
            if (Platform.OS === 'web') {
                window.alert(mensagem);
            } else {
                Alert.alert('Erro', mensagem);
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor="#111827" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    accessibilityLabel="Voltar"
                >
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{isEdicao ? 'Editar Rede' : 'Nova Rede'}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.subtitle}>
                    {isEdicao
                        ? 'Atualize as informações da rede monitorada no K-Wall.'
                        : 'Insira os dados da rede que será administrada pelo K-Wall.'}
                </Text>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome da rede</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="git-network-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Rede Administrativa"
                                placeholderTextColor="#6B7280"
                                value={nome}
                                onChangeText={(text) => {
                                    setNome(text);
                                    setNomeError(text.trim() ? '' : 'Informe o nome da rede.');
                                }}
                                maxLength={80}
                            />
                        </View>
                        {!!nomeError && <Text style={styles.errorText}>{nomeError}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Endereço da rede (CIDR)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="globe-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="192.168.1.0/24"
                                placeholderTextColor="#6B7280"
                                value={enderecoCIDR}
                                onChangeText={(text) => {
                                    setEnderecoCIDR(text);
                                    setCidrError('');
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="numbers-and-punctuation"
                                maxLength={18}
                            />
                        </View>
                        {!!cidrError && <Text style={styles.errorText}>{cidrError}</Text>}
                        <Text style={styles.helperText}>
                            Informe o endereço IPv4 da rede seguido do prefixo, como /24.
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Gateway (opcional)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="log-in-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 192.168.1.1"
                                placeholderTextColor="#6B7280"
                                value={gateway}
                                onChangeText={(text) => {
                                    setGateway(text);
                                    setGatewayError('');
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="numbers-and-punctuation"
                                maxLength={15}
                            />
                        </View>
                        {!!gatewayError && <Text style={styles.errorText}>{gatewayError}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Servidores DNS (opcional)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="server-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="8.8.8.8, 1.1.1.1"
                                placeholderTextColor="#6B7280"
                                value={dns}
                                onChangeText={(text) => {
                                    setDns(text);
                                    setDnsError('');
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>
                        {!!dnsError && <Text style={styles.errorText}>{dnsError}</Text>}
                        <Text style={styles.helperText}>Separe vários endereços por vírgula.</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>VLAN (opcional)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="layers-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: 10"
                                placeholderTextColor="#6B7280"
                                value={vlan}
                                onChangeText={(text) => {
                                    setVlan(text.replace(/[^0-9]/g, ''));
                                    setVlanError('');
                                }}
                                keyboardType="number-pad"
                                maxLength={4}
                            />
                        </View>
                        {!!vlanError && <Text style={styles.errorText}>{vlanError}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Descrição (opcional)</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Descreva a finalidade desta rede..."
                                placeholderTextColor="#6B7280"
                                value={descricao}
                                onChangeText={setDescricao}
                                multiline
                                textAlignVertical="top"
                                maxLength={250}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.statusRow}>
                            <View style={styles.statusTextContainer}>
                                <Text style={styles.label}>Rede ativa</Text>
                                <Text style={styles.statusDescription}>
                                    {ativo ? 'Disponível para associação de dispositivos' : 'Desativada'}
                                </Text>
                            </View>
                            <Switch
                                value={ativo}
                                onValueChange={setAtivo}
                                trackColor={{ false: '#374151', true: '#47D406' }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>

                    {!!mensagemSucesso && (
                        <View style={styles.successContainer}>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#47d406" />
                            <Text style={styles.successText}>{mensagemSucesso}</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    activeOpacity={0.8}
                    onPress={handleSalvar}
                    disabled={saving}
                >
                    {saving ? (
                        <ActivityIndicator color="#111827" />
                    ) : (
                        <>
                            <Ionicons name="shield-checkmark-outline" size={20} color="#111827" />
                            <Text style={styles.submitButtonText}>
                                {isEdicao ? 'Salvar Alterações' : 'Cadastrar Rede'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    placeholder: {
        width: 40
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 40
    },
    subtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 24,
        lineHeight: 20
    },
    form: {
        marginBottom: 30
    },
    inputGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#D1D5DB',
        marginBottom: 8
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 12,
        height: 52,
        paddingHorizontal: 14
    },
    inputIcon: {
        marginRight: 10
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 15,
        height: '100%'
    },
    helperText: {
        color: '#6B7280',
        fontSize: 11,
        marginTop: 6,
        lineHeight: 16
    },
    errorText: {
        color: '#F87171',
        fontSize: 12,
        marginTop: 5
    },
    textAreaContainer: {
        height: 100,
        alignItems: 'flex-start',
        paddingVertical: 12
    },
    textArea: {
        minHeight: 76
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusTextContainer: {
        flex: 1,
        marginRight: 12
    },
    statusDescription: {
        color: '#9CA3AF',
        fontSize: 12
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2
    },
    successText: {
        color: '#47d406',
        fontSize: 13,
        flex: 1
    },
    submitButton: {
        backgroundColor: '#47d406',
        height: 54,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#47d406',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5
    },
    submitButtonDisabled: {
        opacity: 0.65
    },
    submitButtonText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8
    }
});
