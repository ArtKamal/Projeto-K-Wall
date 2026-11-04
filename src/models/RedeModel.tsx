export interface RedeModel{
    id?: string;
    nome: string;
    enderecoCIDR: string;
    gateway?: string;
    dns?: string;
    vlan?: string;
    descricao?: string;
    ativo: boolean;
}