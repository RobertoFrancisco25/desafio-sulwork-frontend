import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ColaboradorService } from './colaborador.service';
import { Colaborador, ColaboradorRequest } from '../models/colaborador.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('ColaboradorService', () => {
  let service: ColaboradorService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/v1/api/colaborador/';

  const mockColaboradores: Colaborador[] = [
    { id: 1, nome: 'João Silva', cpf: '12345678901', itens: [] }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ColaboradorService]
    });

    service = TestBed.inject(ColaboradorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('listarColaboradores', () => {
    it('deve retornar lista de colaboradores', () => {
      service.listarColaboradores().subscribe(colaboradores => {
        expect(colaboradores).toEqual(mockColaboradores);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockColaboradores);
    });

    it('deve propagar erro 500', (done) => {
      service.listarColaboradores().subscribe({
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

  describe('buscarPorCpf', () => {
    it('deve retornar colaborador por CPF', () => {
      const cpf = '12345678901';
      const mockColaborador: Colaborador = { id: 1, nome: 'João Silva', cpf: cpf, itens: [] };

      service.buscarPorCpf(cpf).subscribe(colaborador => {
        expect(colaborador).toEqual(mockColaborador);
      });

      const req = httpMock.expectOne(`${apiUrl}${cpf}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockColaborador);
    });
  });

  describe('criarColaborador', () => {
    it('deve criar um colaborador', () => {
      const request: ColaboradorRequest = { nome: 'João Silva', cpf: '12345678901' };
      const mockColaborador: Colaborador = { id: 1, nome: 'João Silva', cpf: '12345678901', itens: [] };

      service.criarColaborador(request).subscribe(colaborador => {
        expect(colaborador).toEqual(mockColaborador);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockColaborador);
    });
  });

  describe('atualizarColaborador', () => {
    it('deve atualizar um colaborador', () => {
      const id = 1;
      const request: ColaboradorRequest = { nome: 'João Silva Atualizado', cpf: '12345678901' };
      const mockColaborador: Colaborador = { id: 1, nome: 'João Silva Atualizado', cpf: '12345678901', itens: [] };

      service.atualizarColaborador(id, request).subscribe(colaborador => {
        expect(colaborador).toEqual(mockColaborador);
      });

      const req = httpMock.expectOne(`${apiUrl}${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush(mockColaborador);
    });
  });

  describe('deletarColaborador', () => {
    it('deve deletar um colaborador', () => {
      const id = 1;

      service.deletarColaborador(id).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});