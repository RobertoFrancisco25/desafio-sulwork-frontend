import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ItemResponseNomeColaborador, 
  ItemCafeManhaRequest, 
  MarcarItemRequest 
} from '../models/item-cafe-manha.model';

@Injectable({
  providedIn: 'root'
})
export class ItemCafeManhaService {
  private apiUrl = 'http://localhost:8080/v1/api/itens/';

  constructor(private http: HttpClient) { }

  listarItensPorData(data: string): Observable<ItemResponseNomeColaborador[]> {
    return this.http.get<ItemResponseNomeColaborador[]>(`${this.apiUrl}${data}`);
  }

  criarItem(request: ItemCafeManhaRequest): Observable<ItemResponseNomeColaborador> {
    return this.http.post<ItemResponseNomeColaborador>(this.apiUrl, request);
  }

  marcarItem(id: number, request: MarcarItemRequest): Observable<ItemResponseNomeColaborador> {
    return this.http.put<ItemResponseNomeColaborador>(`${this.apiUrl}${id}/marcar`, request);
  }

  deletarItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}