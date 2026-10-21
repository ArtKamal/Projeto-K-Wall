import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
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
import { DispositiveService } from '../services/dispositiveService';

type TipoEndereco = 'ipv4' | 'hostname';

type DispositivoParaEditar = {
    id?: number | string;
    nome: string;

    // Campos novos
    endereco?: string;
    tipoEndereco?: TipoEndereco;
    ativo?: boolean;

    // Campos antigos, para compatibilidade
    hostname?: string;
    status?: string;

    tipo: string;
    nivelCritico: string;
};

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
    Dispositivo: {
        dispositivoParaEditar?: DispositivoParaEditar;
    } | undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Dispositivo'>;

export default function DispositivoScreen({ route, navigation }: Props) {
    const dispositivoParaEditar = route.params?.dispositivoParaEditar;
    const isEdicao = !!dispositivoParaEditar;

    const [nome, setNome] = useState('');
    const [tipoEndereco, setTipoEndereco] =
        useState<TipoEndereco>('ipv4');
    const [endereco, setEndereco] = useState('');
    const [tipo, setTipo] = useState('');
    const [nivelCritico, setNivelCritico] = useState('');
    const [ativo, setAtivo] = useState(true);

    const [nomeError, setNomeError] = useState('');
    const [enderecoError, setEnderecoError] = useState('');
    const [tipoError, setTipoError] = useState('');
    const [nivelCriticoError, setNivelCriticoError] = useState('');
    const [statusError, setStatusError] = useState('');
    const [mensagemSucesso, setMensagemSucesso] = useState('');

    useEffect(() => {
        if (!isEdicao || !dispositivoParaEditar) {
            return;
        }

        const enderecoSalvo =
            dispositivoParaEditar.endereco ??
            dispositivoParaEditar.hostname ??
            '';

        setNome(dispositivoParaEditar.nome);
        setEndereco(enderecoSalvo);

        setTipoEndereco(
            dispositivoParaEditar.tipoEndereco ??
            (isValidIPv4(enderecoSalvo) ? 'ipv4' : 'hostname')
        );

        setTipo(dispositivoParaEditar.tipo);
        setNivelCritico(dispositivoParaEditar.nivelCritico);

        setAtivo(
            dispositivoParaEditar.ativo ??
            dispositivoParaEditar.status?.toLowerCase() === 'ativo'
        );
    }, [dispositivoParaEditar, isEdicao]);

    const validateFields = (): boolean => {
        let isValid = true;

        if (!nome.trim()) {
            setNomeError('Campo obrigatório.');
            isValid = false;
        } else {
            setNomeError('');
        }

        if (!endereco.trim()) {
            setEnderecoError('Campo obrigatório.');
            isValid = false;
        } else if (
            tipoEndereco === 'ipv4'
                ? !isValidIPv4(endereco)
                : !isValidHostname(endereco)
        ) {
            setEnderecoError(
                tipoEndereco === 'ipv4'
                    ? 'Digite um IPv4 válido.'
                    : 'Digite um hostname válido.'
            );
            isValid = false;
        } else {
            setEnderecoError('');
        }

        if (!tipo) {
            setTipoError('Selecione o tipo de dispositivo.');
            isValid = false;
        } else {
            setTipoError('');
        }

        if (!nivelCritico) {
            setNivelCriticoError('Selecione o nível crítico.');
            isValid = false;
        } else {
            setNivelCriticoError('');
        }

        return isValid;
    };

    const isValidIPv4 = (value: string): boolean => {
        const parts = value.trim().split('.');

        if (parts.length !== 4) {
            return false;
        }

        return parts.every((part) => {
            if (!/^\d{1,3}$/.test(part)) {
                return false;
            }

            const number = Number(part);

            return number >= 0 && number <= 255;
        });
    }

    const isValidHostname = (value: string): boolean => {
        const hostname = value.trim();

        if (!hostname || hostname.length > 253) {
            return false;
        }

        return hostname.split('.').every((part) =>
            part.length >= 1 &&
            part.length <= 63 &&
            /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(part)
        );
    }

    const normalizarEndereco = (
        value: string,
        tipo: TipoEndereco
    ): string => {
        const enderecoLimpo = value.trim();

        if (tipo === 'ipv4') {
            return enderecoLimpo
                .split('.')
                .map((part) => String(Number(part)))
                .join('.');
        }

        return enderecoLimpo.toLowerCase();
    }

    const isValidAddress = (value: string): boolean => {
        return isValidIPv4(value) || isValidHostname(value);
    }
    const handleChangeNome = (text: string) => {
        setNome(text);
        if (!text.trim()) {
            setNomeError('Campo obrigatório.');
        } else {
            setNomeError('');
        }
    };
    const handleChangeHostname = (text: string) => {
        setHostname(text);

        if (!text.trim()) {
            setHostnameError('Campo obrigatório.');
        } else if (!isValidAddress(text)) {
            setHostnameError('Digite um endereço IPV4 ou Hostname válido.');
        } else {
            setHostnameError('');
        }
    };
    const handleChangeTipo = (text: string) => {
        setTipo(text);
        if (!text.trim()) {
            setTipoError('Campo obrigatório.');
        } else {
            setTipoError('');
        }
    };
    const handleChangeNivelCritico = (text: string) => {
        setNivelCritico(text);
        if (!text.trim()) {
            setNivelCriticoError('Campo obrigatório.');
        } else {
            setNivelCriticoError('');
        }
    };
    const handleChangeStatus = (text: string) => {
        setStatus(text);
        if (!text.trim()) {
            setStatusError('Campo obrigatório.');
        } else {
            setStatusError('');
        }
    };

    const handleSalvar = async () => {
        setMensagemSucesso('');
        // Limpa a mensagem de sucesso antes de validar
        if (isEdicao) {
            const idParaAtualizar = dispositivoParaEditar?.id;
            if (idParaAtualizar === undefined) {
                return;
            }

            console.log('Atualizando dispositivo ID:', idParaAtualizar);
            await DispositiveService.atualizar(String(idParaAtualizar), {
                nome,
                hostname,
                tipo,
                nivelCritico,
                status
            });
            console.log('Dispositivo atualizado:', { nome, hostname, tipo, nivelCritico, status });
            setMensagemSucesso('Dispositivo atualizado com sucesso!');

            setNome('');
            setHostname('');
            setTipo('');
            setNivelCritico('');
            setStatus('');
        } else {
            if (validateFields()) {
                await DispositiveService.criar({
                    nome,
                    hostname,
                    tipo,
                    nivelCritico,
                    status
                });
                console.log('Dispositivo salvo:', { nome, hostname, tipo, nivelCritico, status });
                setMensagemSucesso('Dispositivo cadastrado com sucesso!');
                // Limpar os campos após salvar
                setNome('');
                setHostname('');
                setTipo('');
                setNivelCritico('');
                setStatus('');
            }
        }
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

                {/* Para centralizar o título */}
                <View style={styles.placeholder} />
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
                                onChangeText={handleChangeNome}
                            />
                        </View>
                        {nomeError ? <Text style={{ color: 'red', marginTop: 4 }}>{nomeError}</Text> : null}
                    </View>

                    {/* Campo IP */}
                    {/* Campo de endereço */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tipo de endereço</Text>

                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            {(['ipv4', 'hostname'] as const).map((opcao) => {
                                const selecionado = tipoEndereco === opcao;

                                return (
                                    <TouchableOpacity
                                        key={opcao}
                                        onPress={() => {
                                            setTipoEndereco(opcao);
                                            setEndereco('');
                                            setEnderecoError('');
                                        }}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 12,
                                            borderRadius: 10,
                                            alignItems: 'center',
                                            backgroundColor: selecionado
                                                ? '#47D406'
                                                : '#1F2937',
                                            borderWidth: 1,
                                            borderColor: selecionado
                                                ? '#47D406'
                                                : '#374151',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: selecionado ? '#111827' : '#D1D5DB',
                                                fontWeight: '600',
                                            }}
                                        >
                                            {opcao === 'ipv4' ? 'IPv4' : 'Hostname'}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={[styles.inputContainer, { marginTop: 12 }]}>
                            <Ionicons
                                name="globe-outline"
                                size={20}
                                color="#9CA3AF"
                                style={styles.inputIcon}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder={
                                    tipoEndereco === 'ipv4'
                                        ? '192.168.1.100'
                                        : 'srv-db-01'
                                }
                                placeholderTextColor="#6B7280"
                                value={endereco}
                                onChangeText={(text) => {
                                    setEndereco(text);
                                    setEnderecoError('');
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                maxLength={tipoEndereco === 'ipv4' ? 15 : 253}
                                keyboardType={
                                    tipoEndereco === 'ipv4'
                                        ? 'numbers-and-punctuation'
                                        : 'default'
                                }
                            />
                        </View>

                        {enderecoError ? (
                            <Text style={{ color: '#F87171', marginTop: 4 }}>
                                {enderecoError}
                            </Text>
                        ) : null}
                    </View>

                    {/* Campo Tipo */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tipo de dispositivo</Text>

                        <View style={styles.inputContainer}>
                            <Picker
                                selectedValue={tipo}
                                onValueChange={(value) => setTipo(value)}
                                style={{ flex: 1, color: '#FFFFFF' }}
                                dropdownIconColor="#FFFFFF"
                            >
                                <Picker.Item
                                    label="Selecione o tipo"
                                    value=""
                                    color="#9CA3AF"
                                />
                                <Picker.Item label="Servidor" value="Servidor" />
                                <Picker.Item label="Roteador" value="Roteador" />
                                <Picker.Item label="Switch" value="Switch" />
                                <Picker.Item label="Firewall" value="Firewall" />
                                <Picker.Item label="Câmera" value="Câmera" />
                                <Picker.Item
                                    label="Estação de trabalho"
                                    value="Estação de trabalho"
                                />
                                <Picker.Item label="Outro" value="Outro" />
                            </Picker>
                        </View>

                        {tipoError ? (
                            <Text style={{ color: '#F87171', marginTop: 4 }}>
                                {tipoError}
                            </Text>
                        ) : null}
                    </View>

                    {/* Campo Nível Crítico */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nível crítico</Text>

                        <View style={styles.inputContainer}>
                            <Picker
                                selectedValue={nivelCritico}
                                onValueChange={(value) => setNivelCritico(value)}
                                style={{ flex: 1, color: '#FFFFFF' }}
                                dropdownIconColor="#FFFFFF"
                            >
                                <Picker.Item
                                    label="Selecione o nível"
                                    value=""
                                    color="#9CA3AF"
                                />
                                <Picker.Item label="Baixo" value="Baixo" />
                                <Picker.Item label="Médio" value="Médio" />
                                <Picker.Item label="Alto" value="Alto" />
                                <Picker.Item label="Crítico" value="Crítico" />
                            </Picker>
                        </View>

                        {nivelCriticoError ? (
                            <Text style={{ color: '#F87171', marginTop: 4 }}>
                                {nivelCriticoError}
                            </Text>
                        ) : null}
                    </View>

                    {/* Campo Status */}
                    <View style={styles.inputGroup}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flex: 1, marginRight: 12 }}>
                                <Text style={styles.label}>Dispositivo ativo</Text>
                                <Text style={{ color: '#9CA3AF', fontSize: 12 }}>
                                    {ativo
                                        ? 'Habilitado no inventário'
                                        : 'Desabilitado no inventário'}
                                </Text>
                            </View>

                            <Switch
                                value={ativo}
                                onValueChange={setAtivo}
                                trackColor={{
                                    false: '#374151',
                                    true: '#47D406',
                                }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
                    {/* Mensagem de sucesso */}
                    {mensagemSucesso ? <Text style={{ color: 'green', marginTop: 4 }}>{mensagemSucesso}</Text> : null}
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