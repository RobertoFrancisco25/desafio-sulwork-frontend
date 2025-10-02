import { ItemCafeManha } from "./item-cafe-manha.model";

export interface Colaborador {
    id: number;
    nome: string;
    cpf: string;
    itens: ItemCafeManha[];
  }
  
  export interface ColaboradorRequest {
    nome: string;
    cpf: string;
  }
  export interface ItemColaborador {
    id: number;
    nome: string;
    trouxeItem: boolean;
    data: string;  
  }