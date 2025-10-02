import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CafeManhaService } from './cafe-manha.service';
import { CafeManha, CafeManhaRequest } from '../models/cafe-manha.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('CafeManhaService', () => {
  let service: CafeManhaService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/v1/api/cafes/';

  const mockCafe: CafeManha = {
    id: 1,
    data: '2024-01-15',
    itens: []
  };

  const mockCafes: CafeManha[] = [
    mockCafe,
    { id: 2, data: '2024-01-16', itens: [] }
  ];

  const mockCafeRequest: CafeManhaRequest = {
    data: '2024-01-15'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CafeManhaService]
    });

    service = TestBed.inject(CafeManhaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('listarCafes', () => {
    it('deve retornar lista de cafés', () => {
      service.listarCafes().subscribe(cafes => {
        expect(cafes).toEqual(mockCafes);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockCafes);
    });

    it('deve propagar erro 500', (done) => {
      service.listarCafes().subscribe({
        next: () => fail('Deveria ter falhado com erro 500'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Erro', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('deletarCafeManha', () => {
    it('deve deletar um café', () => {
      const cafeId = 1;

      service.deletarCafeManha(cafeId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}${cafeId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});