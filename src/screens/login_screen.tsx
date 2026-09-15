import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { signInWithEmailAndPassword} from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (value: string): boolean => {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(value);
    };

    const validatePassword = (senha: string) => {
        const temOitoCaracteres = senha.length >= 8;
        const temLetra = /[A-Za-z]/.test(senha);
        const temNumero = /\d/.test(senha);
        const temSimbolo = /[^A-Za-z\d]/.test(senha);

        return (
            temOitoCaracteres &&
            temLetra &&
            temNumero &&
            temSimbolo
        );
    };

    const senhaTemOitoCaracteres = password.length >= 8;
    const senhaTemLetra = /[A-Za-z]/.test(password);
    const senhaTemNumero = /\d/.test(password);
    const senhaTemSimbolo = /[^A-Za-z\d]/.test(password);

    const handleEmailChange = (text: string) => {
        // Remove espaços e transforma em letras minúsculas
        const emailFormatado = text
            .replace(/\s/g, '')
            .toLowerCase();

        setEmail(emailFormatado);

        // Limpa a mensagem de erro enquanto o usuário digita
        if (emailError !== '') {
            setEmailError('');
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);

        // Limpa a mensagem de erro enquanto o usuário digita
        if (passwordError !== '') {
            setPasswordError('');
        }
    };

    const handleLogin = async () => {
        let valido = true;
 
        // Limpa mensagens anteriores
        setEmailError('');
        setPasswordError('');
 
        if (email.trim() === '') {
            setEmailError('Informe seu e-mail.');
            valido = false;
        } else if (!validateEmail(email.trim())) {
            setEmailError('Informe um e-mail válido.');
            valido = false;
        }
 
        if (password.trim() === '') {
            setPasswordError('Informe sua senha.');
            valido = false;
        } else if (!validatePassword(password)) {
            setPasswordError(
                'A senha deve ter no mínimo 8 caracteres, contendo letras, números e pelo menos um símbolo.'
            );
            valido = false;
        }
 
        if (!valido) {
            return;
        }
 
        setLoading(true);
 
        try {
            // Autenticação com Firebase
            await signInWithEmailAndPassword(auth, email.trim(), password);
 
            // Redireciona para o Dashboard e reseta o histórico para evitar voltar ao Login ao pressionar "Voltar"
            navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
            });
 
        } catch (error: any) {
            let mensagemErro = 'Não foi possível realizar o login. Tente novamente.';
 
            // Tratamento de erros comuns do Firebase Auth
            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    mensagemErro = 'E-mail ou senha incorretos.';
                    break;
                case 'auth/too-many-requests':
                    mensagemErro = 'Muitas tentativas incorretas. Tente novamente mais tarde.';
                    break;
                case 'auth/network-request-failed':
                    mensagemErro = 'Falha de conexão com a internet.';
                    break;
            }
 
           
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="#111827"
            />

            <View style={styles.content}>

                <View style={styles.logoContainer}>
                    <View /*style={styles.logoCircle}*/>
                        <Image style={styles.logo} source={require('../../assets/images/logoCyber.png')} />
                    </View>
                </View>

                {/* Título */}
                <Text style={styles.title}>
                    Bem-vindo de volta!
                </Text>

                <Text style={styles.subtitle}>
                    Entre na sua conta para continuar
                </Text>

                {/* Formulário */}
                <View style={styles.form}>

                    {/* E-mail */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            E-mail
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                emailError ? styles.inputError : null,
                            ]}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);

                                if (emailError) {
                                    setEmailError('');
                                }
                            }}
                            placeholder="seu@email.com"
                            placeholderTextColor="#6B7280"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        {emailError ? (
                            <Text style={styles.errorText}>
                                {emailError}
                            </Text>
                        ) : null}
                    </View>

                    {/* Senha */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Password
                        </Text>

                        <View
                            style={[
                                styles.passwordContainer,
                                passwordError ? styles.inputError : null,
                            ]}
                        >
                            <TextInput
                                style={styles.passwordInput}
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);

                                    if (passwordError) {
                                        setPasswordError('');
                                    }
                                }}
                                placeholder="Digite sua senha"
                                placeholderTextColor="#6B7280"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.showButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={22}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        </View>

                        {passwordError ? (
                            <Text style={styles.errorText}>
                                {passwordError}
                            </Text>
                        ) : null}
                    </View>

                    {/* Esqueci minha senha */}
                    <TouchableOpacity
                        style={styles.forgotButton}
                        onPress={() => {
                            console.log('Esqueci minha senha');
                        }}
                    >
                        <Text style={styles.forgotText}>
                            Esqueci minha senha
                        </Text>
                    </TouchableOpacity>

                    {/* Botão Login */}
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>
                            Entrar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => {
                            navigation.replace('Register');
                        }}
                    >
                        <Text style={styles.registerText}>
                            Ainda não tem uma conta? Cadastre-se
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Rodapé */}
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
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },

    logoContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },

    // logoCircle: {
    //   width: 90,
    //   height: 90,
    //   borderRadius: 45,
    //   backgroundColor: '#FFFFFF',
    //   justifyContent: 'center',
    //   alignItems: 'center',

    //   // Sombra Android
    //   elevation: 8,

    //   // Sombra iOS
    //   shadowColor: '#000000',
    //   shadowOffset: {
    //     width: 0,
    //     height: 4,
    //   },
    //   shadowOpacity: 0.2,
    //   shadowRadius: 8,
    // },

    logoIcon: {
        fontSize: 42,
        fontWeight: '800',
        color: '#111827',
    },

    logoLetra: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    logo: {
        width: 300,
        height: 300,
    },

    title: {
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    subtitle: {
        marginTop: 8,
        textAlign: 'center',
        fontSize: 15,
        color: '#9CA3AF',
    },

    form: {
        marginTop: 40,
    },

    inputContainer: {
        marginBottom: 20,
    },

    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#E5E7EB',
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
        backgroundColor: '#1F2937',
    },

    passwordContainer: {
        height: 52,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 10,
        backgroundColor: '#1F2937',
    },

    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },

    showButton: {
        paddingHorizontal: 14,
    },

    showText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#D1D5DB',
    },

    inputError: {
        borderColor: '#EF4444',
    },

    errorText: {
        marginTop: 6,
        fontSize: 13,
        color: '#F87171',
    },

    forgotButton: {
        alignSelf: 'flex-end',
        marginTop: -5,
        marginBottom: 25,
    },

    forgotText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#D1D5DB',
    },
    registerButton: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 25,
    },

    registerText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#D1D5DB',
    },
    loginButton: {
        height: 52,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    loginButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },

    footer: {
        position: 'absolute',
        bottom: 25,
        alignSelf: 'center',
        fontSize: 12,
        color: '#6B7280',
    },
});
