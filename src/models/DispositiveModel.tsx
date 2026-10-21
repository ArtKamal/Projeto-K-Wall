export interface DispositiveModel {
    id?: string;
    nome: string;
    tipoEndereco: 'ipv4' | 'hostname';
    endereco: string;
    tipo: string;
    nivelCritico: 'Baixo' | 'Médio' | 'Alto';
    ativo: boolean;
}