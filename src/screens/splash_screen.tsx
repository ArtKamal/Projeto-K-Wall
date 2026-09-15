import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Ajuste os nomes das telas conforme seu Navigator
type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
    Dashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Vai para o Login depois de 2 segundos
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 8000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#111827"
      />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View /*style={styles.logoCircle}*/>
            <Image style={styles.logo} source = {require('../../assets/images/logoCyber.png')}/>
          </View>
        </View>

        {/* Nome do aplicativo */}
        {/* <Text style={styles.logoLetra}>K-Wall Cyber</Text> */}

        <Text style={styles.subtitle}>
          Bem-vindo!
        </Text>

        {/* Indicador de carregamento */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
          />

          <Text style={styles.loadingText}>
            Carregando...
          </Text>
        </View>
      </Animated.View>

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
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoContainer: {
    marginBottom: 20,
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
  logo:{
    width: 300,
    height: 300,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#D1D5DB',
    letterSpacing: 0.5,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 45,
  },

  loadingText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#9CA3AF',
  },

  footer: {
    position: 'absolute',
    bottom: 25,
    fontSize: 12,
    color: '#6B7280',
  },
});

