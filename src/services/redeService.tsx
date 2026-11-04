// import { child, get, push, ref, remove, update } from 'firebase/database';
// import { RedeModel } from '../models/RedeModel';
// import { database } from '../services/firebaseConfig';

// // Tipo para mapear os erros de validação de cada campo do formulário
// export type ErrosRede = Partial<Record<keyof RedeModel, string>>;

// export class RedeService {

//     static aplicarMascaraData(texto: string): string {
//         let limpo = texto.replace(/\D/g, '');
//         if (limpo.length > 8) limpo = limpo.substring(0, 8);
//         if (limpo.length <= 2) return limpo;
//         if (limpo.length <= 4) return `${limpo.substring(0, 2)}/${limpo.substring(2)}`;
//         return `${limpo.substring(0, 2)}/${limpo.substring(2, 4)}/${limpo.substring(4)}`;
//     }


//     static validarCampos(dados: RedeModel): { valido: boolean; erros: ErrosRede } {
//         const erros: ErrosRede = {};

//         if (!dados.nome || !dados.nome.trim()) {
//             erros.nome = 'Campo obrigatório.';
//         }

//         if (!dados.endereco || !dados.endereco.trim()) {
//             erros.endereco = 'Campo obrigatório.';
//         }

//         if (!dados.tipo || !dados.tipo.trim()) {
//             erros.tipo = 'Campo obrigatório.';
//         }

//         if (!dados.nivelCritico || !dados.nivelCritico.trim()) {
//             erros.nivelCritico = 'Campo obrigatório.';
//         }

//         return {
//             valido: Object.keys(erros).length === 0,
//             erros,
//         };
//     }
//     static async enderecoJaExiste(
//         tipoEndereco: 'ipv4' | 'hostname',
//         endereco: string,
//         idIgnorado?: string | number
//     ): Promise<boolean> {
//         const dispositivos = await this.listarTodas();

//         const isValidIPv4 = (value: string): boolean => {
//             const parts = value.trim().split('.');

//             if (parts.length !== 4) {
//                 return false;
//             }

//             return parts.every((part) => {
//                 if (!/^\d{1,3}$/.test(part)) {
//                     return false;
//                 }

//                 const number = Number(part);

//                 return number >= 0 && number <= 255;
//             });
//         }
//         const normalizar = (valor: string, tipo: 'ipv4' | 'hostname') => {
//             const limpo = valor.trim();

//             if (tipo === 'ipv4') {
//                 return limpo
//                     .split('.')
//                     .map((parte) => String(Number(parte)))
//                     .join('.');
//             }

//             return limpo.toLowerCase();
//         };

//         const alvo = normalizar(endereco, tipoEndereco);

//         return dispositivos.some((dispositivo) => {
//             // Na edição, ignora o próprio dispositivo.
//             if (
//                 idIgnorado != null &&
//                 String(dispositivo.id) === String(idIgnorado)
//             ) {
//                 return false;
//             }

//             const enderecoSalvo =
//                 dispositivo.endereco ?? '';

//             if (!enderecoSalvo.trim()) {
//                 return false;
//             }

//             const tipoSalvo =
//                 dispositivo.tipoEndereco ??
//                 (isValidIPv4(enderecoSalvo) ? 'ipv4' : 'hostname');

//             return (
//                 tipoSalvo === tipoEndereco &&
//                 normalizar(enderecoSalvo, tipoSalvo) === alvo
//             );
//         });
//     }
//     static async criar(dados: RedeModel): Promise<RedeModel> {
//         try {
//             const redesRef = ref(database, 'redes');

//             // Gera uma chave/ID única no nó "redes"
//             const novaRedeRef = push(redesRef);
//             const novoId = novaRedeRef.key;

//             if (!novoId) {
//                 throw new Error('Não foi possível gerar um ID único no Firebase.');
//             }

//             const novaRede: RedeModel = {
//                 ...dados,
//                 id: novoId,
//             };

//             // Guarda os dados na referência criada
//             await update(novaRedeRef, novaRede);

//             return novaRede;
//         } catch (error) {
//             console.error('Erro ao criar rede no Firebase:', error);
//             throw new Error('Falha ao registar a rede no banco de dados.');
//         }
//     }

//     static async listarTodas(): Promise<RedeModel[]> {
//         try {
//             const dbRef = ref(database);
//             const snapshot = await get(child(dbRef, 'redes'));

//             if (snapshot.exists()) {
//                 const data = snapshot.val();

//                 // Transforma o objeto retornado do Firebase num array de RedeModel
//                 return Object.keys(data).map((key) => ({
//                     id: key,
//                     ...data[key],
//                 }));
//             }

//             return [];
//         } catch (error) {
//             console.error('Erro ao listar redes do Firebase:', error);
//             throw new Error('Falha ao carregar as redes.');
//         }
//     }

//     static async obterPorId(id: string): Promise<RedeModel | null> {
//         try {
//             const dbRef = ref(database);
//             const snapshot = await get(child(dbRef, `redes/${id}`));

//             if (snapshot.exists()) {
//                 return {
//                     id,
//                     ...snapshot.val(),
//                 };
//             }

//             return null;
//         } catch (error) {
//             console.error(`Erro ao buscar rede com ID ${id}:`, error);
//             throw new Error('Falha ao obter os dados da rede.');
//         }
//     }

//     static async atualizar(id: string, dados: RedeModel): Promise<boolean> {
//         try {
//             const redeRef = ref(database, `redes/${id}`);

//             const dadosAtualizados: RedeModel = {
//                 ...dados,
//                 id,
//             };

//             await update(redeRef, dadosAtualizados);
//             return true;
//         } catch (error) {
//             console.error(`Erro ao atualizar rede com ID ${id}:`, error);
//             throw new Error('Falha ao atualizar a rede.');
//         }
//     }

//     static async eliminar(id: string): Promise<boolean> {
//         try {
//             const redeRef = ref(database, `redes/${id}`);
//             await remove(redeRef);
//             return true;
//         } catch (error) {
//             console.error(`Erro ao eliminar rede com ID ${id}:`, error);
//             throw new Error('Falha ao remover a rede.');
//         }
//     }
//     // Exemplo no componente que carrega a lista
// }