import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemCafeManhaListComponent } from './item-cafe-manha-list.component';
import { ItemCafeManhaService } from '../../services/item-cafe-manha.service';
import { ColaboradorService } from '../../services/colaborador.service';
import { CafeManhaService } from '../../services/cafe-manha.service';
import { ItemResponseNomeColaborador, ItemCafeManhaRequest } from '../../models/item-cafe-manha.model';
import { Colaborador } from '../../models/colaborador.model';
import { CafeManha } from '../../models/cafe-manha.model';

describe('ItemCafeManhaListComponent', () => {
  let component: ItemCafeManhaListComponent;
  let fixture: ComponentFixture<ItemCafeManhaListComponent>;
  let itemService: jasmine.SpyObj<ItemCafeManhaService>;
  let colaboradorService: jasmine.SpyObj<ColaboradorService>;
  let cafeManhaService: jasmine.SpyObj<CafeManhaService>;

  const mockItens: ItemResponseNomeColaborador[] = [
    { id: 1, nome: 'Café', trouxeItem: true, nomeColaborador: 'João Silva', cpfColaborador: '12345678901', dataCafe: '2024-01-15' },
    { id: 2, nome: 'Pão', trouxeItem: false, nomeColaborador: 'Maria Santos', cpfColaborador: '98765432100', dataCafe: '2024-01-15' }
  ];

  const mockColaboradores: Colaborador[] = [
    { id: 1, nome: 'João Silva', cpf: '12345678901', itens: [] as any },
    { id: 2, nome: 'Maria Santos', cpf: '98765432100', itens: [] as any }
  ];

  const mockCafes: CafeManha[] = [
    { id: 1, data: '2024-01-15', itens: [] },
    { id: 2, data: '2024-01-16', itens: [] }
  ];

  beforeEach(async () => {
    const itemServiceSpy = jasmine.createSpyObj('ItemCafeManhaService', [
      'listarItensPorData',
      'criarItem',
      'marcarItem',
      'deletarItem'
    ]);

    const colaboradorServiceSpy = jasmine.createSpyObj('ColaboradorService', [
      'listarColaboradores'
    ]);

    const cafeManhaServiceSpy = jasmine.createSpyObj('CafeManhaService', [
      'listarCafes'
    ]);

    await TestBed.configureTestingModule({
      imports: [ItemCafeManhaListComponent, RouterTestingModule],
      providers: [
        { provide: ItemCafeManhaService, useValue: itemServiceSpy },
        { provide: ColaboradorService, useValue: colaboradorServiceSpy },
        { provide: CafeManhaService, useValue: cafeManhaServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCafeManhaListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemCafeManhaService) as jasmine.SpyObj<ItemCafeManhaService>;
    colaboradorService = TestBed.inject(ColaboradorService) as jasmine.SpyObj<ColaboradorService>;
    cafeManhaService = TestBed.inject(CafeManhaService) as jasmine.SpyObj<CafeManhaService>;

    // CONFIGURAR OS MOCKS
    cafeManhaService.listarCafes.and.returnValue(of(mockCafes));
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('carregarItens', () => {
    it('deve carregar itens com sucesso', () => {
      itemService.listarItensPorData.and.returnValue(of(mockItens));

      component.carregarItens();

      expect(component.carregando).toBeFalse();
      expect(component.itens).toEqual(mockItens);
    });

    it('deve tratar 404 como lista vazia', () => {
      const error = { status: 404 };
      itemService.listarItensPorData.and.returnValue(throwError(() => error));

      component.carregarItens();

      expect(component.itens).toEqual([]);
      expect(component.carregando).toBeFalse();
    });

    it('deve mostrar erro para outros status', () => {
      const error = { status: 500 };
      itemService.listarItensPorData.and.returnValue(throwError(() => error));

      component.carregarItens();

      expect(component.mensagem).toBe('Erro ao carregar itens');
      expect(component.tipoMensagem).toBe('error');
    });
  });

  describe('marcar item', () => {
    it('deve marcar item como trazido', () => {
      itemService.marcarItem.and.returnValue(of({} as any));
      itemService.listarItensPorData.and.returnValue(of(mockItens));
  
      component.marcarItem(1, true);
        
      expect(itemService.marcarItem).toHaveBeenCalledWith(1, { trouxeItem: true });
      
      expect(itemService.listarItensPorData).toHaveBeenCalled();
    });
  });

  describe('deletar item', () => {
    it('deve deletar item com confirmação', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      itemService.deletarItem.and.returnValue(of(void 0));
      itemService.listarItensPorData.and.returnValue(of(mockItens));

      component.deletarItem(1);

      expect(itemService.deletarItem).toHaveBeenCalledWith(1);
    });
  });
});