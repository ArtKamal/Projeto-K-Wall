// import React, { useCallback, useState } from 'react';
// import {
//     ActivityIndicator,
//     Alert,
//     FlatList,
//     Platform,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from 'react-native';

// import { Ionicons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { RedeModel } from '../models/RedeModel';
// import { RedeService } from '../services/redeService';

// type RootStackParamList = {
//     Splash: undefined;
//     Login: undefined;
//     Register: undefined;
//     Dashboard: undefined;
//     Redes: undefined;
//     Rede: { redeParaEditar?: RedeModel } | undefined;
// };

// type Props = NativeStackScreenProps<RootStackParamList, 'Redes'>;

// export default function RedesScreen({ navigation }: Props) {
//     const [redes, setRedes] = useState<RedeModel[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);

//     const carregarRedes = async () => {
//         try {
//             setLoading(true);
//             const dados = await RedeService.listarTodas();
//             setRedes(dados);
//         } catch (error) {
//             console.error('Erro ao carregar redes:', error);
//             if (Platform.OS === 'web') {
//                 window.alert('Não foi possível carregar as redes.');
//             } else {
//                 Alert.alert('Erro', 'Não foi possível carregar as redes.');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     useFocusEffect(
//         useCallback(() => {
//             carregarRedes();
//         }, [])
//     );

//     const deletarRede = async (id: string) => {
//         try {
//             await RedeService.eliminar(id);
//             await carregarRedes();
//         } catch (error) {
//             console.error('Erro ao excluir rede:', error);
//             if (Platform.OS === 'web') {
//                 window.alert('Não foi possível excluir a rede.');
//             } else {
//                 Alert.alert('Erro', 'Não foi possível excluir a rede.');
//             }
//         }
//     };

//     const confirmarExclusao = (id: string | undefined, nome: string) => {
//         if (!id) return;

//         if (Platform.OS === 'web') {
//             const confirmou = window.confirm(
//                 `Deseja realmente remover a rede "${nome}"?`
//             );
//             if (confirmou) deletarRede(id);
//             return;
//         }

//         Alert.alert(
//             'Excluir rede',
//             `Deseja realmente remover a rede "${nome}"?`,
//             [
//                 { text: 'Cancelar', style: 'cancel' },
//                 {
//                     text: 'Excluir',
//                     style: 'destructive',
//                     onPress: () => deletarRede(id)
//                 }
//             ]
//         );
//     }
// }