import { CafeManha } from "./cafe-manha.model";
import { Colaborador } from "./colaborador.model";

export interface ItemCafeManha {
    id: number;
    nome: string;
    trouxeItem: boolean;
    colaborador: Colaborador;
    cafeManha: CafeManha;
    data?: string;
  }
  
  export interface ItemResponseNomeColaborador {
    id: number;
    nome: string;
    trouxeItem: boolean;
    nomeColaborador: string;
    cpfColaborador: string;
    dataCafe: string;
  }
  
  export interface ItemCafeManhaRequest {
    nome: string;
    cpfColaborador: string;
    dataCafe: string;
  }
  
  export interface MarcarItemRequest {
    trouxeItem: boolean;
  } 