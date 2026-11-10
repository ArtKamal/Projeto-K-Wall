export interface RedeModel{
    id?: string;
    nome: string;
    enderecoCIDR: string;
    gateway?: string;
    dns?: string[];
    vlan?: number;
    descricao?: string;
    ativo: boolean;
}