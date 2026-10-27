export interface DispositiveModel {
    id?: string;
    nome: string;
    tipoEndereco: 'ipv4' | 'hostname';
    endereco: string;
    tipo: string;
    nivelCritico: string;
    ativo: boolean;
}