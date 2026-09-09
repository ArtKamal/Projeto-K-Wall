import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { userService } from '../services/userService';
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // -----------------------------------------
  // Máscara de celular
  // -----------------------------------------
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');

    if (numbers.length <= 2) {
      return `(${numbers}`;
    }

    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    }

    return `(${numbers.slice(0, 2)}) ${numbers.slice(
      2,
      7
    )}-${numbers.slice(7, 11)}`;
  };

  // -----------------------------------------
  // Validação de e-mail
  // -----------------------------------------
  const validateEmail = (value: string): boolean => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(value);
  };

  // -----------------------------------------
  // Alteração do celular
  // -----------------------------------------
  const handlePhoneChange = (value: string) => {
    const formattedPhone = formatPhone(value);

    setPhone(formattedPhone);

    if (phoneError) {
      setPhoneError('');
    }
  };

  // -----------------------------------------
  // Alteração do e-mail
  // -----------------------------------------
  const handleEmailChange = (value: string) => {
    setEmail(value.toLowerCase());

    if (emailError) {
      setEmailError('');
    }
  };

  // -----------------------------------------
  // Cadastro
  // -----------------------------------------
  const handleRegister = async () => {
    let valid = true;

    // Limpa erros anteriores
    setNameError('');
    setPhoneError('');
    setEmailError('');
    setPasswordError('');

    // -----------------------------------------
    // Nome
    // -----------------------------------------
    if (!name.trim()) {
      setNameError('Digite seu nome.');
      valid = false;
    }

    // -----------------------------------------
    // Celular
    // -----------------------------------------
    const phoneNumbers = phone.replace(/\D/g, '');

    if (!phone.trim()) {
      setPhoneError('Digite seu celular.');
      valid = false;
    } else if (phoneNumbers.length < 11) {
      setPhoneError('Digite um celular válido.');
      valid = false;
    }

    // -----------------------------------------
    // E-mail
    // -----------------------------------------
    if (!email.trim()) {
      setEmailError('Digite seu e-mail.');
      valid = false;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Digite um e-mail válido.');
      valid = false;
    }

    // -----------------------------------------
    // Senha
    // -----------------------------------------
    if (!password.trim()) {
      setPasswordError('Digite sua senha.');
      valid = false;
    }

    // -----------------------------------------
    // Se houver algum erro, não continua
    // -----------------------------------------
    if (!valid) {
      return;
    }

    // -----------------------------------------
    // Aqui será feita a chamada para a API
    // -----------------------------------------
    await userService.cadastrarUsuario(
      name.trim(),
      phoneNumbers,
      email.trim(),
      password
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#111827"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>M</Text>
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>
            Criar conta
          </Text>

          <Text style={styles.subtitle}>
            Preencha seus dados para começar
          </Text>

          {/* Formulário */}
          <View style={styles.form}>

            {/* Nome */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Nome
              </Text>

              <TextInput
                style={[
                  styles.input,
                  nameError ? styles.inputError : null,
                ]}
                value={name}
                onChangeText={(text) => {
                  setName(text);

                  if (nameError) {
                    setNameError('');
                  }
                }}
                placeholder="Digite seu nome"
                placeholderTextColor="#6B7280"
                autoCapitalize="words"
                autoCorrect={false}
              />

              {nameError ? (
                <Text style={styles.errorText}>
                  {nameError}
                </Text>
              ) : null}
            </View>

            {/* Celular */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Celular
              </Text>

              <TextInput
                style={[
                  styles.input,
                  phoneError ? styles.inputError : null,
                ]}
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="(11) 99999-9999"
                placeholderTextColor="#6B7280"
                keyboardType="phone-pad"
                maxLength={15}
              />

              {phoneError ? (
                <Text style={styles.errorText}>
                  {phoneError}
                </Text>
              ) : null}
            </View>

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
                onChangeText={handleEmailChange}
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
                  onPress={() =>
                    setShowPassword(!showPassword)
                  }
                  style={styles.showButton}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      showPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
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

            {/* Botão */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>
                Cadastrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                navigation.replace('Login');
              }}
            >
              <Text style={styles.loginText}>
                Já tem uma conta? Faça login
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>

      {/* Rodapé */}
      <Text style={styles.footer}>
        © 2026 Meu App
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 45,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',

    elevation: 8,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  logoIcon: {
    fontSize: 34,
    fontWeight: '800',
    color: '#111827',
  },

  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
    loginButton: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 25,
    },

    loginText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#D1D5DB',
    },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
    color: '#9CA3AF',
  },

  form: {
    marginTop: 32,
  },

  inputContainer: {
    marginBottom: 18,
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
    height: '100%',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  errorText: {
    marginTop: 6,
    fontSize: 13,
    color: '#F87171',
  },

  registerButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  registerButtonText: {
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

