import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Colaborador, ColaboradorRequest } from '../models/colaborador.model';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private apiUrl = 'http://localhost:8080/v1/api/colaborador/';

  constructor(private http: HttpClient) { }

  listarColaboradores(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.apiUrl);
  }

  buscarPorCpf(cpf: string): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${this.apiUrl}${cpf}`);
  }

  criarColaborador(request: ColaboradorRequest): Observable<Colaborador> {
    return this.http.post<Colaborador>(this.apiUrl, request);
  }

  atualizarColaborador(id: number, request: ColaboradorRequest): Observable<Colaborador> {
    return this.http.put<Colaborador>(`${this.apiUrl}${id}`, request);
  }

  deletarColaborador(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}