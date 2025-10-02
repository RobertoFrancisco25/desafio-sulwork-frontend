export interface CafeManha {
  id: number;
  data: string;
  itens: ItemCafeManhaResponse[]; 
}

export interface ItemCafeManhaResponse {
  id: number;
  nome: string;
  trouxeItem: boolean;
  nomeColaborador: string;         
  cpfColaborador: string;          
}

export interface CafeManhaRequest {
  data: string;
}

