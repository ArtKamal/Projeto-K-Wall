
import axios from 'axios';

import type { RedeModel } from '../models/RedeModel';
import { API_KEY, BIN_URL, URL } from '../constants/config';

// Dados da rede sem o ID, pois ele será gerado pelo serviço.
type RedeDados = Omit<RedeModel, 'id'>;

// Formato da resposta retornada pelo JSONBin.
interface JSONBinResponse {
    record: {
        redes: RedeModel[];
    };
    metadata?: {
        id?: string;
        private?: boolean;
    };
}

// Cabeçalhos utilizados nas requisições.
const headers = {
    'X-Master-Key': API_KEY,
    'Content-Type': 'application/json'
};

// Gera um identificador para cada rede cadastrada.
const gerarId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// Converte erros do Axios em mensagens mais úteis.
const tratarErro = (
    error: unknown,
    mensagemPadrao: string
): Error => {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        const mensagemAPI = error.response?.data?.message;

        if (mensagemAPI) {
            return new Error(mensagemAPI);
        }

        if (!error.response) {
            return new Error(
                'Não foi possível conectar ao JSONBin. Verifique sua conexão.'
            );
        }
    }

    if (error instanceof Error) {
        return error;
    }

    return new Error(mensagemPadrao);
};

// Busca todas as redes armazenadas no Bin.
const buscarRedes = async (): Promise<RedeModel[]> => {
    const response = await axios.get<JSONBinResponse>(URL, {
        headers: {
            'X-Master-Key': API_KEY
        }
    });

    const redes = response.data?.record?.redes;

    if (!Array.isArray(redes)) {
        throw new Error(
            'Estrutura inválida no JSONBin. Verifique se o Bin contém { "redes": [] }.'
        );
    }

    return redes;
};

// Substitui o conteúdo do Bin pela nova lista de redes.
const salvarRedes = async (redes: RedeModel[]): Promise<void> => {
    await axios.put(
        BIN_URL,
        { redes },
        { headers }
    );
};

export const RedeService = {

    // LISTAR TODAS AS REDES
    async listarTodas(): Promise<RedeModel[]> {
        try {
            return await buscarRedes();

        } catch (error) {
            console.error('Erro ao listar redes:', error);

            throw tratarErro(
                error,
                'Falha ao carregar as redes.'
            );
        }
    },

    // CADASTRAR UMA NOVA REDE
    async criar(dados: RedeDados): Promise<void> {
        try {
            const redesAtuais = await buscarRedes();

            const novaRede: RedeModel = {
                ...dados,
                id: gerarId()
            };

            const novasRedes = [
                ...redesAtuais,
                novaRede
            ];

            await salvarRedes(novasRedes);

            console.log('Rede cadastrada:', novaRede);

        } catch (error) {
            console.error('Erro ao cadastrar rede:', error);

            throw tratarErro(
                error,
                'Falha ao cadastrar a rede.'
            );
        }
    },

    // ATUALIZAR UMA REDE EXISTENTE
    async atualizar(
        id: string,
        dados: RedeDados
    ): Promise<void> {
        try {
            const redesAtuais = await buscarRedes();

            const existe = redesAtuais.some(
                rede => rede.id === id
            );

            if (!existe) {
                throw new Error('Rede não encontrada.');
            }

            const redesAtualizadas = redesAtuais.map(rede =>
                rede.id === id
                    ? { ...dados, id }
                    : rede
            );

            await salvarRedes(redesAtualizadas);

            console.log('Rede atualizada:', id);

        } catch (error) {
            console.error('Erro ao atualizar rede:', error);

            throw tratarErro(
                error,
                'Falha ao atualizar a rede.'
            );
        }
    },

    // EXCLUIR UMA REDE
    async eliminar(id: string): Promise<void> {
        try {
            const redesAtuais = await buscarRedes();

            const existe = redesAtuais.some(
                rede => rede.id === id
            );

            if (!existe) {
                throw new Error('Rede não encontrada.');
            }

            const redesAtualizadas = redesAtuais.filter(
                rede => rede.id !== id
            );

            await salvarRedes(redesAtualizadas);

            console.log('Rede removida:', id);

        } catch (error) {
            console.error('Erro ao excluir rede:', error);

            throw tratarErro(
                error,
                'Falha ao excluir a rede.'
            );
        }
    }
};
