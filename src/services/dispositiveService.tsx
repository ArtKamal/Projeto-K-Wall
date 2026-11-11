
import axios from 'axios';

import type { DispositiveModel } from '../models/DispositiveModel';

import {
    API_KEY,
    DISPOSITIVOS_BIN_URL,
    DISPOSITIVOS_URL
} from '../constants/config';

// Todos os campos do dispositivo, exceto o ID.
// O ID será gerado pelo serviço.
type DispositivoDados = Omit<DispositiveModel, 'id'>;

// Formato esperado da resposta do JSONBin.
interface JSONBinResponse {
    record: {
        dispositivos: DispositiveModel[];
    };
}

// Cabeçalhos das requisições.
const headers = {
    'X-Master-Key': API_KEY,
    'Content-Type': 'application/json'
};

// Gera um ID para cada dispositivo.
const gerarId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// Recupera todos os dispositivos do JSONBin.
const buscarDispositivos = async (): Promise<DispositiveModel[]> => {

    const response = await axios.get<JSONBinResponse>(
        DISPOSITIVOS_URL,
        {
            headers: {
                'X-Master-Key': API_KEY
            }
        }
    );

    const dispositivos = response.data?.record?.dispositivos;

    if (!Array.isArray(dispositivos)) {
        throw new Error('Estrutura inválida no Bin de dispositivos.');
    }

    return dispositivos;
};

// Atualiza o documento inteiro no JSONBin.
const salvarDispositivos = async (
    dispositivos: DispositiveModel[]
): Promise<void> => {

    await axios.put(
        DISPOSITIVOS_BIN_URL,
        { dispositivos },
        { headers }
    );
};

export const DispositiveService = {

    // LISTAR
    async listarTodas(): Promise<DispositiveModel[]> {
        try {
            return await buscarDispositivos();

        } catch (error) {
            console.error('Erro ao listar dispositivos:', error);

            throw tratarErro(error, 'Falha ao carregar os dispositivos.');
        }
    },

    // CADASTRAR
    async criar(dados: DispositivoDados): Promise<void> {
        try {
            const dispositivos = await buscarDispositivos();

            const novoDispositivo: DispositiveModel = {
                ...dados,
                id: gerarId()
            };

            const atualizados = [
                ...dispositivos,
                novoDispositivo
            ];

            await salvarDispositivos(atualizados);

            console.log('Dispositivo cadastrado:', novoDispositivo);

        } catch (error) {
            console.error('Erro ao cadastrar dispositivo:', error);

            throw tratarErro(error, 'Falha ao cadastrar dispositivo.');
        }
    },

    // ATUALIZAR
    async atualizar(
        id: string | number,
        dados: DispositivoDados
    ): Promise<void> {
        try {
            const dispositivos = await buscarDispositivos();

            const existe = dispositivos.some(
                dispositivo => String(dispositivo.id) === String(id)
            );

            if (!existe) {
                throw new Error('Dispositivo não encontrado.');
            }

            const atualizados = dispositivos.map(dispositivo =>
                String(dispositivo.id) === String(id)
                    ? { ...dados, id: dispositivo.id }
                    : dispositivo
            );

            await salvarDispositivos(atualizados);

            console.log('Dispositivo atualizado:', id);

        } catch (error) {
            console.error('Erro ao atualizar dispositivo:', error);

            throw tratarErro(error, 'Falha ao atualizar dispositivo.');
        }
    },

    // EXCLUIR
    async eliminar(id: string | number): Promise<void> {
        try {
            const dispositivos = await buscarDispositivos();

            const atualizados = dispositivos.filter(
                dispositivo => String(dispositivo.id) !== String(id)
            );

            if (atualizados.length === dispositivos.length) {
                throw new Error('Dispositivo não encontrado.');
            }

            await salvarDispositivos(atualizados);

            console.log('Dispositivo removido:', id);

        } catch (error) {
            console.error('Erro ao excluir dispositivo:', error);

            throw tratarErro(error, 'Falha ao excluir dispositivo.');
        }
    }
};

// Tratamento de erros da API.
function tratarErro(error: unknown, mensagem: string): Error {

    if (axios.isAxiosError(error)) {
        const resposta = error.response?.data as
            { message?: string } | undefined;

        if (resposta?.message) {
            return new Error(resposta.message);
        }

        if (!error.response) {
            return new Error('Não foi possível conectar ao JSONBin.');
        }
    }

    if (error instanceof Error) {
        return error;
    }

    return new Error(mensagem);
}
