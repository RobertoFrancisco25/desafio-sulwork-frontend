import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemCafeManhaService } from './item-cafe-manha.service';
import { 
  ItemResponseNomeColaborador, 
  ItemCafeManhaRequest, 
  MarcarItemRequest 
} from '../models/item-cafe-manha.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('ItemCafeManhaService', () => {
  let service: ItemCafeManhaService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8080/v1/api/itens/';

  const mockItem: ItemResponseNomeColaborador = {
    id: 1,
    nome: 'Café',
    trouxeItem: false,
    nomeColaborador: 'João Silva',
    cpfColaborador: '12345678901',
    dataCafe: '2024-01-15'
  };

  const mockItens: ItemResponseNomeColaborador[] = [mockItem];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemCafeManhaService]
    });

    service = TestBed.inject(ItemCafeManhaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('listarItensPorData', () => {
    it('deve retornar lista de itens por data', () => {
      const data = '2024-01-15';

      service.listarItensPorData(data).subscribe(itens => {
        expect(itens).toEqual(mockItens);
      });

      const req = httpMock.expectOne(`${apiUrl}${data}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockItens);
    });

    it('deve propagar erro 404', (done) => {
      const data = '2024-01-20';

      service.listarItensPorData(data).subscribe({
        next: () => fail('Deveria ter falhado com 404'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}${data}`);
      req.flush('Not Found', { 
        status: 404, 
        statusText: 'Not Found' 
      });
    });

    it('deve propagar erro 500', (done) => {
      const data = '2024-01-15';

      service.listarItensPorData(data).subscribe({
        next: () => fail('Deveria ter falhado com 500'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}${data}`);
      req.flush('Erro', { 
        status: 500, 
        statusText: 'Internal Server Error' 
      });
    });
  });

  describe('criarItem', () => {
    it('deve criar um item', () => {
      const request: ItemCafeManhaRequest = {
        nome: 'Café',
        cpfColaborador: '12345678901',
        dataCafe: '2024-01-15'
      };

      service.criarItem(request).subscribe(item => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockItem);
    });
  });

  describe('marcarItem', () => {
    it('deve marcar um item', () => {
      const id = 1;
      const request: MarcarItemRequest = {
        trouxeItem: true
      };

      service.marcarItem(id, request).subscribe(item => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne(`${apiUrl}${id}/marcar`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush(mockItem);
    });
  });

  describe('deletarItem', () => {
    it('deve deletar um item', () => {
      const id = 1;

      service.deletarItem(id).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});