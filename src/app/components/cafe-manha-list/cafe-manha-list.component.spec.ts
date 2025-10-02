import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CafeManhaListComponent } from './cafe-manha-list.component';
import { CafeManhaService } from '../../services/cafe-manha.service';
import { CafeManha, CafeManhaRequest } from '../../models/cafe-manha.model';

describe('CafeManhaListComponent', () => {
  let component: CafeManhaListComponent;
  let fixture: ComponentFixture<CafeManhaListComponent>;
  let cafeManhaService: jasmine.SpyObj<CafeManhaService>;

  const mockCafes: CafeManha[] = [
    { id: 1, data: '2024-01-15', itens: [] },
    { id: 2, data: '2024-01-16', itens: [] }
  ];

  beforeEach(async () => {
    const cafeServiceSpy = jasmine.createSpyObj('CafeManhaService', [
      'listarCafes',
      'criarCafeManha',
      'atualizarCafeManha',
      'deletarCafeManha'
    ]);

    await TestBed.configureTestingModule({
      imports: [CafeManhaListComponent],
      providers: [
        { provide: CafeManhaService, useValue: cafeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CafeManhaListComponent);
    component = fixture.componentInstance;
    cafeManhaService = TestBed.inject(CafeManhaService) as jasmine.SpyObj<CafeManhaService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('carregarCafes', () => {
    it('deve carregar lista de cafés com sucesso', () => {
      cafeManhaService.listarCafes.and.returnValue(of(mockCafes));

      component.carregarCafes();

      expect(component.carregando).toBeFalse();
      expect(component.cafes).toEqual(mockCafes);
    });

    it('deve tratar erro ao carregar cafés', () => {
      cafeManhaService.listarCafes.and.returnValue(throwError(() => new Error('Erro')));

      component.carregarCafes();

      expect(component.carregando).toBeFalse();
    });
  });

  describe('deletarCafe', () => {
    it('deve chamar serviço para deletar café', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      cafeManhaService.deletarCafeManha.and.returnValue(of(void 0));
      cafeManhaService.listarCafes.and.returnValue(of(mockCafes));

      component.deletarCafe(1);

      expect(cafeManhaService.deletarCafeManha).toHaveBeenCalledWith(1);
    });
  });
});