import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CafeManha, CafeManhaRequest } from '../models/cafe-manha.model';

@Injectable({
  providedIn: 'root'
})
export class CafeManhaService {
  private apiUrl = 'http://localhost:8080/v1/api/cafes/';

  constructor(private http: HttpClient) { }

  listarCafes(): Observable<CafeManha[]> {
    return this.http.get<CafeManha[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<CafeManha> {
    return this.http.get<CafeManha>(`${this.apiUrl}${id}`);
  }

  buscarPorData(data: string): Observable<CafeManha> {
    return this.http.get<CafeManha>(`${this.apiUrl}data/${data}`);
  }

  criarCafeManha(request: CafeManhaRequest): Observable<CafeManha> {
    return this.http.post<CafeManha>(this.apiUrl, request);
  }

  atualizarCafeManha(id: number, request: CafeManhaRequest): Observable<CafeManha> {
    return this.http.put<CafeManha>(`${this.apiUrl}${id}`, request);
  }

  deletarCafeManha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}