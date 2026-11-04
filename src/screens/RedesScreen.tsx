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
//     };

//     const renderRede = ({ item }: { item: RedeModel }) => {
//         const ativa = item.status === 'ativa';

//         return (
//             <View style={styles.card}>
//                 <View style={styles.cardHeader}>
//                     <View style={styles.networkIcon}>
//                         <Ionicons name="git-network-outline" size={24} color="#47d406" />
//                     </View>

//                     <View style={styles.networkHeaderInfo}>
//                         <Text style={styles.networkName} numberOfLines={1}>
//                             {item.nome || 'Rede sem nome'}
//                         </Text>
//                         <Text style={styles.networkAddress}>
//                             {item.enderecoCIDR || 'CIDR não informado'}
//                         </Text>
//                     </View>

//                     <View
//                         style={[
//                             styles.statusIndicator,
//                             ativa ? styles.statusActive : styles.statusInactive
//                         ]}
//                     />
//                 </View>

//                 <View style={styles.actionsRow}>
//                     <TouchableOpacity
//                         style={styles.actionIconBtn}
//                         onPress={() => navigation.navigate('Rede', { redeParaEditar: item })}
//                         accessibilityLabel={`Editar rede ${item.nome}`}
//                     >
//                         <Ionicons name="create-outline" size={18} color="#47d406" />
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                         style={[styles.actionIconBtn, { borderColor: '#7F1D1D' }]}
//                         onPress={() => confirmarExclusao(item.id, item.nome)}
//                         accessibilityLabel={`Excluir rede ${item.nome}`}
//                     >
//                         <Ionicons name="trash-outline" size={18} color="#EF4444" />
//                     </TouchableOpacity>
//                 </View>

//                 <View style={styles.divider} />

//                 <View style={styles.infoGrid}>
//                     <View style={styles.infoItem}>
//                         <Ionicons name="log-in-outline" size={17} color="#9CA3AF" />
//                         <View style={styles.infoTextContainer}>
//                             <Text style={styles.infoLabel}>Gateway</Text>
//                             <Text style={styles.infoValue}>{item.gateway || 'Não informado'}</Text>
//                         </View>
//                     </View>

//                     <View style={styles.infoItem}>
//                         <Ionicons name="layers-outline" size={17} color="#9CA3AF" />
//                         <View style={styles.infoTextContainer}>
//                             <Text style={styles.infoLabel}>VLAN</Text>
//                             <Text style={styles.infoValue}>
//                                 {item.vlan !== undefined && item.vlan !== null ? item.vlan : 'Não definida'}
//                             </Text>
//                         </View>
//                     </View>
//                 </View>

//                 {!!item.dns?.length && (
//                     <View style={[styles.infoItem, styles.dnsRow]}>
//                         <Ionicons name="globe-outline" size={17} color="#9CA3AF" />
//                         <View style={styles.infoTextContainer}>
//                             <Text style={styles.infoLabel}>DNS</Text>
//                             {/* <Text style={styles.infoValue}>{item.dns.join(', ')}</Text> */}
//                         </View>
//                     </View>
//                 )}

//                 <View style={styles.cardFooter}>
//                     <View style={[styles.statusBadge, ativa ? styles.activeBadge : styles.inactiveBadge]}>
//                         <Ionicons
//                             name={ativa ? 'checkmark-circle-outline' : 'pause-circle-outline'}
//                             size={14}
//                             color="#FFFFFF"
//                         />
//                         <Text style={styles.badgeText}>{ativa ? 'Ativa' : 'Inativa'}</Text>
//                     </View>
//                     {!!item.descricao && (
//                         <Text style={styles.description} numberOfLines={1}>
//                             {item.descricao}
//                         </Text>
//                     )}
//                 </View>
//             </View>
//         );
//     };

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <StatusBar barStyle="light-content" backgroundColor="#111827" />
//                 <ActivityIndicator size="large" color="#47d406" />
//                 <Text style={styles.loadingText}>Carregando redes...</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor="#111827" />

//             <View style={styles.header}>
//                 <TouchableOpacity
//                     style={styles.backButton}
//                     onPress={() => navigation.goBack()}
//                     accessibilityLabel="Voltar"
//                 >
//                     <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
//                 </TouchableOpacity>

//                 <View>
//                     <Text style={styles.headerTitle}>Redes</Text>
//                     <Text style={styles.headerSubtitle}>Redes cadastradas</Text>
//                 </View>

//                 <TouchableOpacity
//                     style={styles.addButton}
//                     onPress={() => navigation.navigate('Rede', {})}
//                     accessibilityLabel="Cadastrar nova rede"
//                 >
//                     <Ionicons name="add" size={25} color="#111827" />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.summaryContainer}>
//                 <Text style={styles.summaryTitle}>Redes cadastradas</Text>
//                 <View style={styles.counter}>
//                     <Text style={styles.counterText}>{redes.length}</Text>
//                 </View>
//             </View>

//             <FlatList
//                 data={redes}
//                 keyExtractor={(item) => item.id?.toString() ?? `${item.nome}-${item.enderecoCIDR}`}
//                 renderItem={renderRede}
//                 contentContainerStyle={redes.length === 0 ? styles.emptyList : styles.list}
//                 showsVerticalScrollIndicator={false}
//                 ListEmptyComponent={
//                     <View style={styles.emptyContainer}>
//                         <Ionicons name="git-network-outline" size={60} color="#4B5563" />
//                         <Text style={styles.emptyTitle}>Nenhuma rede cadastrada</Text>
//                         <Text style={styles.emptyText}>
//                             Cadastre sua primeira rede para organizar os dispositivos monitorados.
//                         </Text>
//                         <TouchableOpacity
//                             style={styles.emptyButton}
//                             onPress={() => navigation.navigate('Rede', {})}
//                         >
//                             <Ionicons name="add" size={20} color="#111827" />
//                             <Text style={styles.emptyButtonText}>Nova rede</Text>
//                         </TouchableOpacity>
//                     </View>
//                 }
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#111827'
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 20,
//         paddingTop: Platform.OS === 'android' ? 20 : 50,
//         paddingBottom: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: '#1F2937'
//     },
//     backButton: {
//         width: 40,
//         height: 40,
//         borderRadius: 10,
//         backgroundColor: '#1F2937',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: '#374151'
//     },
//     headerTitle: {
//         color: '#FFFFFF',
//         fontSize: 20,
//         fontWeight: 'bold',
//         textAlign: 'center'
//     },
//     headerSubtitle: {
//         color: '#9CA3AF',
//         fontSize: 12,
//         textAlign: 'center',
//         marginTop: 2
//     },
//     addButton: {
//         width: 40,
//         height: 40,
//         borderRadius: 10,
//         backgroundColor: '#47d406',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     summaryContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 24,
//         paddingTop: 24,
//         paddingBottom: 16
//     },
//     summaryTitle: {
//         color: '#D1D5DB',
//         fontSize: 14,
//         fontWeight: '600'
//     },
//     counter: {
//         backgroundColor: '#1F2937',
//         paddingHorizontal: 12,
//         paddingVertical: 5,
//         borderRadius: 20
//     },
//     counterText: {
//         color: '#47d406',
//         fontWeight: 'bold'
//     },
//     list: {
//         paddingHorizontal: 20,
//         paddingBottom: 30
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#111827'
//     },
//     loadingText: {
//         marginTop: 10,
//         color: '#D1D5DB',
//         fontSize: 14
//     },
//     card: {
//         backgroundColor: '#1F2937',
//         borderRadius: 14,
//         padding: 16,
//         marginBottom: 14,
//         borderWidth: 1,
//         borderColor: '#374151'
//     },
//     cardHeader: {
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     networkIcon: {
//         width: 45,
//         height: 45,
//         borderRadius: 10,
//         backgroundColor: '#111827',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 12
//     },
//     networkHeaderInfo: {
//         flex: 1
//     },
//     networkName: {
//         color: '#FFFFFF',
//         fontSize: 16,
//         fontWeight: 'bold'
//     },
//     networkAddress: {
//         color: '#9CA3AF',
//         fontSize: 13,
//         marginTop: 3
//     },
//     statusIndicator: {
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         marginLeft: 10
//     },
//     statusActive: {
//         backgroundColor: '#47d406'
//     },
//     statusInactive: {
//         backgroundColor: '#EF4444'
//     },
//     actionsRow: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         marginTop: 10,
//         gap: 10
//     },
//     actionIconBtn: {
//         width: 30,
//         height: 30,
//         borderRadius: 6,
//         backgroundColor: '#1F2937',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: '#374151'
//     },
//     divider: {
//         height: 1,
//         backgroundColor: '#374151',
//         marginVertical: 14
//     },
//     infoGrid: {
//         flexDirection: 'row',
//         gap: 20,
//         marginBottom: 12
//     },
//     infoItem: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 10
//     },
//     infoTextContainer: {
//         flex: 1
//     },
//     infoLabel: {
//         color: '#6B7280',
//         fontSize: 11
//     },
//     infoValue: {
//         color: '#D1D5DB',
//         fontSize: 13,
//         marginTop: 2
//     },
//     dnsRow: {
//         marginBottom: 12
//     },
//     cardFooter: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         gap: 10
//     },
//     statusBadge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 8,
//         gap: 5
//     },
//     activeBadge: {
//         backgroundColor: '#16A34A'
//     },
//     inactiveBadge: {
//         backgroundColor: '#DC2626'
//     },
//     badgeText: {
//         color: '#FFFFFF',
//         fontSize: 11,
//         fontWeight: 'bold'
//     },
//     description: {
//         flex: 1,
//         color: '#9CA3AF',
//         fontSize: 11,
//         textAlign: 'right'
//     },
//     emptyList: {
//         flexGrow: 1,
//         justifyContent: 'center'
//     },
//     emptyContainer: {
//         alignItems: 'center',
//         paddingHorizontal: 40
//     },
//     emptyTitle: {
//         color: '#FFFFFF',
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginTop: 18
//     },
//     emptyText: {
//         color: '#9CA3AF',
//         textAlign: 'center',
//         fontSize: 14,
//         lineHeight: 20,
//         marginTop: 8
//     },
//     emptyButton: {
//         flexDirection: 'row',
//         backgroundColor: '#47d406',
//         paddingHorizontal: 18,
//         paddingVertical: 12,
//         borderRadius: 10,
//         alignItems: 'center',
//         gap: 7,
//         marginTop: 20
//     },
//     emptyButtonText: {
//         color: '#111827',
//         fontWeight: 'bold'
//     }
// });
