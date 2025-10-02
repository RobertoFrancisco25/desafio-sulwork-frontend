import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ColaboradorListComponent } from './colaborador-list.component';
import { ColaboradorService } from '../../services/colaborador.service';
import { Colaborador, ColaboradorRequest } from '../../models/colaborador.model';

describe('ColaboradorListComponent', () => {
  let component: ColaboradorListComponent;
  let fixture: ComponentFixture<ColaboradorListComponent>;
  let colaboradorService: jasmine.SpyObj<ColaboradorService>;

  const mockColaboradores: Colaborador[] = [
    { 
      id: 1, 
      nome: 'João Silva', 
      cpf: '12345678901', 
      itens: [] as any
    },
    { 
      id: 2, 
      nome: 'Maria Santos', 
      cpf: '98765432100', 
      itens: [] 
    }
  ];

  beforeEach(async () => {
    const colaboradorServiceSpy = jasmine.createSpyObj('ColaboradorService', [
      'listarColaboradores',
      'criarColaborador',
      'atualizarColaborador',
      'deletarColaborador'
    ]);

    await TestBed.configureTestingModule({
      imports: [ColaboradorListComponent],
      providers: [
        { provide: ColaboradorService, useValue: colaboradorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ColaboradorListComponent);
    component = fixture.componentInstance;
    colaboradorService = TestBed.inject(ColaboradorService) as jasmine.SpyObj<ColaboradorService>;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('carregarColaboradores', () => {
    it('deve carregar lista de colaboradores com sucesso', () => {
      colaboradorService.listarColaboradores.and.returnValue(of(mockColaboradores));

      component.carregarColaboradores();

      expect(component.carregando).toBeFalse();
      expect(component.colaboradores).toEqual(mockColaboradores);
    });

    it('deve mostrar mensagem de erro ao falhar carregamento', () => {
      colaboradorService.listarColaboradores.and.returnValue(throwError(() => new Error('Erro')));

      component.carregarColaboradores();

      expect(component.carregando).toBeFalse();
      expect(component.mensagem).toBe('Erro ao carregar colaboradores');
      expect(component.tipoMensagem).toBe('error');
    });
  });

  describe('deletarColaborador', () => {
    it('deve chamar serviço para deletar colaborador', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      colaboradorService.deletarColaborador.and.returnValue(of(void 0));
      colaboradorService.listarColaboradores.and.returnValue(of(mockColaboradores));

      component.deletarColaborador(1);

      expect(colaboradorService.deletarColaborador).toHaveBeenCalledWith(1);
    });
  });
});