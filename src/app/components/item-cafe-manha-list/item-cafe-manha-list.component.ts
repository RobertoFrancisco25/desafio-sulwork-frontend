import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ItemResponseNomeColaborador, 
  ItemCafeManhaRequest, 
  MarcarItemRequest 
} from '../../models/item-cafe-manha.model';
import { ItemCafeManhaService } from '../../services/item-cafe-manha.service';
import { Colaborador } from '../../models/colaborador.model';
import { ColaboradorService } from '../../services/colaborador.service';
import { CafeManha } from '../../models/cafe-manha.model';
import { CafeManhaService } from '../../services/cafe-manha.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-cafe-manha-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './item-cafe-manha-list.component.html',
  styleUrl: './item-cafe-manha-list.component.css'
})
export class ItemCafeManhaListComponent implements OnInit {
  // Dados
  itens: ItemResponseNomeColaborador[] = [];
  colaboradores: Colaborador[] = [];
  cafes: CafeManha[] = [];
  router: Router = inject(Router);
  // Estados da UI
  mostrarFormCriar = false;
  mensagem: string = '';
  tipoMensagem: 'success' | 'error' | 'info' = 'info';
  carregando: boolean = false;
  atualizandoItens: Set<number> = new Set();

  // Filtros e Forms
  dataSelecionada: string = new Date().toISOString().split('T')[0];
  novoItem: ItemCafeManhaRequest = {
    nome: '',
    cpfColaborador: '',
    dataCafe: this.dataSelecionada
  };
  // Estatísticas calculadas
  get totalItens(): number {
    return this.itens.length;
  }

  get itensTrazidos(): number {
    return this.itens.filter(item => item.trouxeItem).length;
  }

  get itensPendentes(): number {
    return this.itens.filter(item => !item.trouxeItem).length;
  }

  constructor(
    private itemService: ItemCafeManhaService,
    private colaboradorService: ColaboradorService,
    private cafeManhaService: CafeManhaService
  ) { }

  ngOnInit(): void {
    this.carregarItens();
    this.carregarColaboradores();
    this.carregarCafes();
  }
  irParaCafes(): void {
    this.router.navigate(['/cafes']);
  }
  carregarItens(): void {
    this.carregando = true;
    this.limparMensagem(); // Limpar mensagens anteriores
    this.atualizarListaCafes();
    this.itemService.listarItensPorData(this.dataSelecionada).subscribe({
      next: (itens) => {
        this.itens = itens || []; // Garantir que seja array
        this.carregando = false;
      },
      error: (error) => {
        // Se for 404, significa que não há itens para esta data (comportamento normal)
        if (error.status === 404) {
          this.itens = [];
          this.carregando = false;
          return;
        }
        
        // Para outros erros, mostrar mensagem
        this.mostrarMensagem('Erro ao carregar itens', 'error');
        this.carregando = false;
      }
    });
  }

  carregarColaboradores(): void {
    this.colaboradorService.listarColaboradores().subscribe({
      next: (colaboradores) => {
        this.colaboradores = colaboradores;
      },
      error: (error) => {
        
      }
    });
  }

  carregarCafes(): void {
    this.cafeManhaService.listarCafes().subscribe({
      next: (cafes) => {
        this.cafes = cafes;
      },
      error: (error) => {
        
      }
    });
  }

  onDataChange(): void {
    this.limparMensagem(); // Limpar mensagens ao trocar data
    this.atualizarListaCafes();
    this.carregarItens();
    this.novoItem.dataCafe = this.dataSelecionada;
  }

  // CRIAÇÃO
  abrirFormCriar(): void {
    this.mostrarFormCriar = true;
    this.novoItem = {
      nome: '',
      cpfColaborador: '',
      dataCafe: this.dataSelecionada
    };
    this.limparMensagem();
  }

  criarItem(): void {
    if (!this.validarFormulario()) return;

    this.carregando = true;
    this.itemService.criarItem(this.novoItem).subscribe({
      next: (itemCriado) => {
        this.mostrarMensagem('Item criado com sucesso!', 'success');
        this.carregarItens();
        this.fecharForm();
        this.carregando = false;
      },
      error: (error) => {
        this.mostrarMensagem('Erro ao criar item: ' + this.getErrorMessage(error), 'error');
        this.carregando = false;
      }
    });
  }

  // ATUALIZAÇÃO DE STATUS
  marcarItem(id: number, trouxeItem: boolean): void {
    this.atualizandoItens.add(id);
    
    const request: MarcarItemRequest = { trouxeItem };
    this.itemService.marcarItem(id, request).subscribe({
      next: (itemAtualizado) => {
        this.mostrarMensagem(`Item ${trouxeItem ? 'marcado como trazido' : 'desmarcado'}!`, 'success');
        this.carregarItens();
        this.atualizandoItens.delete(id);
      },
      error: (error) => {
        this.mostrarMensagem('Erro ao atualizar item', 'error');
        this.atualizandoItens.delete(id);
      }
    });
  }
  atualizarListaCafes(): void {
    this.cafeManhaService.listarCafes().subscribe({
      next: (cafes) => {
        this.cafes = cafes;
        
      },
      error: (error) => {
        
      }
    });
  }

  // EXCLUSÃO
  deletarItem(id: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.carregando = true;
      this.itemService.deletarItem(id).subscribe({
        next: () => {
          this.mostrarMensagem('Item excluído com sucesso!', 'success');
          this.carregarItens();
          this.carregando = false;
        },
        error: (error) => {
          this.mostrarMensagem('Erro ao excluir item', 'error');
          this.carregando = false;
        }
      });
    }
  }

  // UTILITÁRIOS
  validarFormulario(): boolean {
    if (!this.novoItem.nome.trim()) {
      this.mostrarMensagem('Nome do item é obrigatório', 'error');
      return false;
    }
    if (!this.novoItem.cpfColaborador) {
      this.mostrarMensagem('Selecione um colaborador', 'error');
      return false;
    }
    return true;
  }

  fecharForm(): void {
    this.mostrarFormCriar = false;
  }

  mostrarMensagem(mensagem: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    
  }

  limparMensagem(): void {
    this.mensagem = '';
  }

  getErrorMessage(error: any): string {
    if (error.error?.message) return error.error.message;
    if (error.status === 400) return 'Dados inválidos';
    if (error.status === 404) return 'Colaborador ou café não encontrado';
    return 'Erro desconhecido';
  }

  cafeExisteParaData(): boolean {
    return this.cafes.some(cafe => cafe.data === this.dataSelecionada);
  }
  
}