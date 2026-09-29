import { child, get, push, ref, remove, update } from 'firebase/database';
import { DispositiveModel } from '../models/DispositiveModel';
import { database } from '../services/firebaseConfig';
 
// Tipo para mapear os erros de validação de cada campo do formulário
export type ErrosDispositive = Partial<Record<keyof DispositiveModel, string>>;
 
export class DispositiveService {
   
    static aplicarMascaraData(texto: string): string {
        let limpo = texto.replace(/\D/g, '');
        if (limpo.length > 8) limpo = limpo.substring(0, 8);
        if (limpo.length <= 2) return limpo;
        if (limpo.length <= 4) return `${limpo.substring(0, 2)}/${limpo.substring(2)}`;
        return `${limpo.substring(0, 2)}/${limpo.substring(2, 4)}/${limpo.substring(4)}`;
    }
 
   
    static validarCampos(dados: DispositiveModel): { valido: boolean; erros: ErrosDispositive } {
        const erros: ErrosDispositive = {};
 
        if (!dados.nome || !dados.nome.trim()) {
            erros.nome = 'Campo obrigatório.';
        }
 
        if (!dados.hostname || !dados.hostname.trim()) {
            erros.hostname = 'Campo obrigatório.';
        }
 
        if (!dados.tipo || !dados.tipo.trim()) {
            erros.tipo = 'Campo obrigatório.';
        }
 
        if (!dados.nivelCritico || !dados.nivelCritico.trim()) {
            erros.nivelCritico = 'Campo obrigatório.';
        }
 
        if (!dados.status || !dados.status.trim()) {
            erros.status = 'Campo obrigatório.';
        }
 
        return {
            valido: Object.keys(erros).length === 0,
            erros,
        };
    }
 
    static async criar(dados: DispositiveModel): Promise<DispositiveModel> {
        try {
            const dispositivosRef = ref(database, 'dispositivos');
           
            // Gera uma chave/ID única no nó "dispositivos"
            const novoDispositivoRef = push(dispositivosRef);
            const novoId = novoDispositivoRef.key;
 
            if (!novoId) {
                throw new Error('Não foi possível gerar um ID único no Firebase.');
            }
 
            const novoDispositivo: DispositiveModel = {
                ...dados,
                id: novoId,
            };
 
            // Guarda os dados na referência criada
            await update(novoDispositivoRef, novoDispositivo);
 
            return novoDispositivo;
        } catch (error) {
            console.error('Erro ao criar dispositivo no Firebase:', error);
            throw new Error('Falha ao registar o dispositivo no banco de dados.');
        }
    }
 
    static async listarTodas(): Promise<DispositiveModel[]> {
        try {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, 'dispositivos'));
 
            if (snapshot.exists()) {
                const data = snapshot.val();
 
                // Transforma o objeto retornado do Firebase num array de DispositiveModel
                return Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
            }
 
            return [];
        } catch (error) {
            console.error('Erro ao listar dispositivos do Firebase:', error);
            throw new Error('Falha ao carregar os dispositivos.');
        }
    }
 
    static async obterPorId(id: string): Promise<DispositiveModel | null> {
        try {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, `dispositivos/${id}`));
 
            if (snapshot.exists()) {
                return {
                    id,
                    ...snapshot.val(),
                };
            }
 
            return null;
        } catch (error) {
            console.error(`Erro ao buscar dispositivo com ID ${id}:`, error);
            throw new Error('Falha ao obter os dados do dispositivo.');
        }
    }
 
    static async atualizar(id: string, dados: DispositiveModel): Promise<boolean> {
        try {
            const dispositivoRef = ref(database, `dispositivos/${id}`);
 
            const dadosAtualizados: DispositiveModel = {
                ...dados,
                id,
            };
 
            await update(dispositivoRef, dadosAtualizados);
            return true;
        } catch (error) {
            console.error(`Erro ao atualizar dispositivo com ID ${id}:`, error);
            throw new Error('Falha ao atualizar o dispositivo.');
        }
    }
 
    static async eliminar(id: string): Promise<boolean> {
        try {
            const dispositivoRef = ref(database, `dispositivos/${id}`);
            await remove(dispositivoRef);
            return true;
        } catch (error) {
            console.error(`Erro ao eliminar dispositivo com ID ${id}:`, error);
            throw new Error('Falha ao remover o dispositivo.');
        }
    }
}