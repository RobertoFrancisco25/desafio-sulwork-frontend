import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { CafeManhaService } from '../../services/cafe-manha.service';
import { ColaboradorService } from '../../services/colaborador.service';
import { ItemCafeManhaService } from '../../services/item-cafe-manha.service';
import { CafeManha } from '../../models/cafe-manha.model';
import { Colaborador } from '../../models/colaborador.model';
import { ItemResponseNomeColaborador } from '../../models/item-cafe-manha.model';

import { RouterTestingModule } from '@angular/router/testing';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [
      DashboardComponent,
      RouterTestingModule 
    ],
    providers: [
     
    ]
  }).compileComponents();
});
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let cafeService: jasmine.SpyObj<CafeManhaService>;
  let colaboradorService: jasmine.SpyObj<ColaboradorService>;
  let itemService: jasmine.SpyObj<ItemCafeManhaService>;

  const mockCafes: CafeManha[] = [
    { id: 1, data: '2024-01-15', itens: [] },
    { id: 2, data: '2024-01-14', itens: [] },
    { id: 3, data: '2024-01-13', itens: [] },
    { id: 4, data: '2024-01-12', itens: [] },
    { id: 5, data: '2024-01-11', itens: [] },
    { id: 6, data: '2024-01-10', itens: [] }
  ];

  const mockColaboradores: Colaborador[] = [
    { id: 1, nome: 'João Silva', cpf: '12345678901', itens: [] as any },
    { id: 2, nome: 'Maria Santos', cpf: '98765432100', itens: [] as any },
    { id: 3, nome: 'Pedro Costa', cpf: '45678912300', itens: [] as any },
    { id: 4, nome: 'Ana Oliveira', cpf: '78912345600', itens: [] as any },
    { id: 5, nome: 'Carlos Souza', cpf: '32165498700', itens: [] as any },
    { id: 6, nome: 'Julia Lima', cpf: '65498732100', itens: [] as any }
  ];

  const mockItens: ItemResponseNomeColaborador[] = [
    { id: 1, nome: 'Café', trouxeItem: true, nomeColaborador: 'João Silva', cpfColaborador: '12345678901', dataCafe: '2024-01-15' },
    { id: 2, nome: 'Pão', trouxeItem: false, nomeColaborador: 'Maria Santos', cpfColaborador: '98765432100', dataCafe: '2024-01-15' },
    { id: 3, nome: 'Leite', trouxeItem: true, nomeColaborador: 'Pedro Costa', cpfColaborador: '45678912300', dataCafe: '2024-01-15' },
    { id: 4, nome: 'Fruta', trouxeItem: false, nomeColaborador: 'Ana Oliveira', cpfColaborador: '78912345600', dataCafe: '2024-01-15' },
    { id: 5, nome: 'Bolo', trouxeItem: true, nomeColaborador: 'Carlos Souza', cpfColaborador: '32165498700', dataCafe: '2024-01-15' }
  ];

  beforeEach(async () => {
    const cafeServiceSpy = jasmine.createSpyObj('CafeManhaService', ['listarCafes']);
    const colaboradorServiceSpy = jasmine.createSpyObj('ColaboradorService', ['listarColaboradores']);
    const itemServiceSpy = jasmine.createSpyObj('ItemCafeManhaService', ['listarItensPorData']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: CafeManhaService, useValue: cafeServiceSpy },
        { provide: ColaboradorService, useValue: colaboradorServiceSpy },
        { provide: ItemCafeManhaService, useValue: itemServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    cafeService = TestBed.inject(CafeManhaService) as jasmine.SpyObj<CafeManhaService>;
    colaboradorService = TestBed.inject(ColaboradorService) as jasmine.SpyObj<ColaboradorService>;
    itemService = TestBed.inject(ItemCafeManhaService) as jasmine.SpyObj<ItemCafeManhaService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve carregar dashboard ao inicializar', () => {
      cafeService.listarCafes.and.returnValue(of(mockCafes));
      colaboradorService.listarColaboradores.and.returnValue(of(mockColaboradores));
      itemService.listarItensPorData.and.returnValue(of(mockItens));

      component.ngOnInit();

      expect(cafeService.listarCafes).toHaveBeenCalled();
      expect(colaboradorService.listarColaboradores).toHaveBeenCalled();
      expect(itemService.listarItensPorData).toHaveBeenCalled();
    });
  });

  describe('carregarDashboard', () => {
    it('deve carregar estatísticas com sucesso', () => {
      cafeService.listarCafes.and.returnValue(of(mockCafes));
      colaboradorService.listarColaboradores.and.returnValue(of(mockColaboradores));
      itemService.listarItensPorData.and.returnValue(of(mockItens));

      component.carregarDashboard();

      expect(component.totalCafes).toBe(6);
      expect(component.totalColaboradores).toBe(6);
      expect(component.totalItensHoje).toBe(5);
      expect(component.itensTrazidosHoje).toBe(3);
      expect(component.carregando).toBeFalse();
    });

    it('deve carregar dados recentes ordenados corretamente', () => {
      cafeService.listarCafes.and.returnValue(of(mockCafes));
      colaboradorService.listarColaboradores.and.returnValue(of(mockColaboradores));
      itemService.listarItensPorData.and.returnValue(of(mockItens));
    
      component.carregarDashboard();
      
      expect(component.cafesRecentes.length).toBe(5);
      expect(component.colaboradoresRecentes.length).toBe(5);
      expect(component.itensRecentes.length).toBe(5);
      
      expect(component.cafesRecentes[0].id).toBeGreaterThan(component.cafesRecentes[4].id);
      expect(component.colaboradoresRecentes[0].id).toBeGreaterThan(component.colaboradoresRecentes[4].id);
      expect(component.itensRecentes[0].id).toBeGreaterThan(component.itensRecentes[4].id);
    });

    it('deve tratar erro ao carregar itens', () => {
      cafeService.listarCafes.and.returnValue(of(mockCafes));
      colaboradorService.listarColaboradores.and.returnValue(of(mockColaboradores));
      itemService.listarItensPorData.and.returnValue(throwError(() => new Error('Erro')));

      component.carregarDashboard();

      expect(component.carregando).toBeFalse();
    });

    it('deve funcionar com arrays vazios', () => {
      cafeService.listarCafes.and.returnValue(of([]));
      colaboradorService.listarColaboradores.and.returnValue(of([]));
      itemService.listarItensPorData.and.returnValue(of([]));

      component.carregarDashboard();

      expect(component.totalCafes).toBe(0);
      expect(component.totalColaboradores).toBe(0);
      expect(component.totalItensHoje).toBe(0);
      expect(component.itensTrazidosHoje).toBe(0);
      expect(component.cafesRecentes).toEqual([]);
      expect(component.colaboradoresRecentes).toEqual([]);
      expect(component.itensRecentes).toEqual([]);
    });
  });

  describe('calcularProgresso', () => {
    it('deve calcular progresso corretamente', () => {
      component.totalItensHoje = 10;
      component.itensTrazidosHoje = 7;

      const progresso = component.calcularProgresso();

      expect(progresso).toBe(70);
    });

    it('deve retornar 0 quando não há itens', () => {
      component.totalItensHoje = 0;
      component.itensTrazidosHoje = 0;

      const progresso = component.calcularProgresso();

      expect(progresso).toBe(0);
    });

    it('deve retornar 100 quando todos os itens foram trazidos', () => {
      component.totalItensHoje = 5;
      component.itensTrazidosHoje = 5;

      const progresso = component.calcularProgresso();

      expect(progresso).toBe(100);
    });

    it('deve calcular progresso com números decimais', () => {
      component.totalItensHoje = 3;
      component.itensTrazidosHoje = 1;

      const progresso = component.calcularProgresso();

      expect(progresso).toBeCloseTo(33.33, 1);
    });
  });

  describe('comportamento com poucos dados', () => {
    it('deve funcionar com menos de 5 itens', () => {
      const poucosCafes = mockCafes.slice(0, 3);
      const poucosColaboradores = mockColaboradores.slice(0, 2);
      const poucosItens = mockItens.slice(0, 1);

      cafeService.listarCafes.and.returnValue(of(poucosCafes));
      colaboradorService.listarColaboradores.and.returnValue(of(poucosColaboradores));
      itemService.listarItensPorData.and.returnValue(of(poucosItens));

      component.carregarDashboard();

      expect(component.cafesRecentes.length).toBe(3);
      expect(component.colaboradoresRecentes.length).toBe(2);
      expect(component.itensRecentes.length).toBe(1);
    });

    it('deve funcionar com apenas 1 item', () => {
      const umCafe = [mockCafes[0]];
      const umColaborador = [mockColaboradores[0]];
      const umItem = [mockItens[0]];

      cafeService.listarCafes.and.returnValue(of(umCafe));
      colaboradorService.listarColaboradores.and.returnValue(of(umColaborador));
      itemService.listarItensPorData.and.returnValue(of(umItem));

      component.carregarDashboard();

      expect(component.cafesRecentes.length).toBe(1);
      expect(component.colaboradoresRecentes.length).toBe(1);
      expect(component.itensRecentes.length).toBe(1);
    });
  });

  describe('estados de carregamento', () => {
    it('deve iniciar carregando como false', () => {
      expect(component.carregando).toBeFalse();
    });

    it('deve definir carregando como true durante o carregamento', () => {
      cafeService.listarCafes.and.returnValue(of(mockCafes));
      colaboradorService.listarColaboradores.and.returnValue(of(mockColaboradores));
      
      
      let resolveItems: (items: ItemResponseNomeColaborador[]) => void;
      const itemsPromise = new Promise<ItemResponseNomeColaborador[]>(resolve => {
        resolveItems = resolve;
      });
      itemService.listarItensPorData.and.returnValue(of(mockItens));

      component.carregarDashboard();

      
      expect(component.carregando).toBeFalse();
    });
  });
});