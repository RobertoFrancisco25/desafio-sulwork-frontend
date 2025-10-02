import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Colaborador, ColaboradorRequest, ItemColaborador } from '../../models/colaborador.model';
import { ColaboradorService } from '../../services/colaborador.service';

@Component({
  selector: 'app-colaborador-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './colaborador-list.component.html',
  styleUrl: './colaborador-list.component.css'
})
export class ColaboradorListComponent implements OnInit {
  // Dados
  colaboradores: Colaborador[] = [];
  colaboradorSelecionado: Colaborador | null = null;
  
  // Estados da UI
  mostrarFormCriar = false;
  mostrarFormEditar = false;
  mensagem: string = '';
  tipoMensagem: 'success' | 'error' | 'info' = 'info';
  carregando: boolean = false;

  // Forms
  novoColaborador: ColaboradorRequest = { nome: '', cpf: '' };
  colaboradorEditando: ColaboradorRequest = { nome: '', cpf: '' };
  idEditando: number | null = null;

  constructor(private colaboradorService: ColaboradorService) { }

  ngOnInit(): void {
    this.carregarColaboradores();
  }
  
  carregarColaboradores(): void {
    this.carregando = true;
    this.colaboradorService.listarColaboradores().subscribe({
      next: (colaboradores) => {
        this.colaboradores = colaboradores;
        this.carregando = false;
      },
      error: (error) => {
        this.mostrarMensagem('Erro ao carregar colaboradores', 'error');
        this.carregando = false;
      }
    });
  }

  selecionarColaborador(colaborador: Colaborador): void {
    this.colaboradorSelecionado = colaborador;
  }

  // CRIAÇÃO
  abrirFormCriar(): void {
    this.mostrarFormCriar = true;
    this.mostrarFormEditar = false;
    this.novoColaborador = { nome: '', cpf: '' };
    this.limparMensagem();
  }

  criarColaborador(): void {
    if (!this.validarFormulario(this.novoColaborador)) return;

    this.carregando = true;
    this.colaboradorService.criarColaborador(this.novoColaborador).subscribe({
      next: (colaboradorCriado) => {
        this.mostrarMensagem('Colaborador criado com sucesso!', 'success');
        this.carregarColaboradores();
        this.fecharForms();
        this.carregando = false;
      },
      error: (error) => {
        this.mostrarMensagem('Erro ao criar colaborador: ' + this.getErrorMessage(error), 'error');
        this.carregando = false;
      }
    });
  }

  // EDIÇÃO
  abrirFormEditar(colaborador: Colaborador): void {
    this.mostrarFormEditar = true;
    this.mostrarFormCriar = false;
    this.colaboradorEditando = { nome: colaborador.nome, cpf: colaborador.cpf };
    this.idEditando = colaborador.id;
    this.limparMensagem();
  }

  atualizarColaborador(): void {
    if (!this.idEditando || !this.validarFormulario(this.colaboradorEditando)) return;

    this.carregando = true;
    this.colaboradorService.atualizarColaborador(this.idEditando, this.colaboradorEditando).subscribe({
      next: (colaboradorAtualizado) => {
        this.mostrarMensagem('Colaborador atualizado com sucesso!', 'success');
        this.carregarColaboradores();
        this.fecharForms();
        this.carregando = false;
      },
      error: (error) => {
        this.mostrarMensagem('Erro ao atualizar colaborador: ' + this.getErrorMessage(error), 'error');
        this.carregando = false;
      }
    });
  }

  // EXCLUSÃO
  deletarColaborador(id: number): void {
    if (confirm('Tem certeza que deseja excluir este colaborador?')) {
      this.carregando = true;
      this.colaboradorService.deletarColaborador(id).subscribe({
        next: () => {
          this.mostrarMensagem('Colaborador excluído com sucesso!', 'success');
          this.carregarColaboradores();
          this.colaboradorSelecionado = null;
          this.carregando = false;
        },
        error: (error) => {
          this.mostrarMensagem('Erro ao excluir colaborador', 'error');
          this.carregando = false;
        }
      });
    }
  }

  // UTILITÁRIOS
  validarFormulario(colaborador: ColaboradorRequest): boolean {
    if (!colaborador.nome.trim()) {
      this.mostrarMensagem('Nome é obrigatório', 'error');
      return false;
    }
    if (!colaborador.cpf.trim()) {
      this.mostrarMensagem('CPF é obrigatório', 'error');
      return false;
    }
    return true;
  }

  formatarCPF(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  fecharForms(): void {
    this.mostrarFormCriar = false;
    this.mostrarFormEditar = false;
    this.idEditando = null;
  }

  mostrarMensagem(mensagem: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
    if (tipo === 'success') {
    setTimeout(() => this.limparMensagem(), 5000);
    }
    
   }

  limparMensagem(): void {
    this.mensagem = '';
  }

  getErrorMessage(error: any): string {
    if (error.error?.message) return error.error.message;
    if (error.status === 400) return 'Dados inválidos';
    if (error.status === 409) return 'CPF já cadastrado';
    return 'Erro desconhecido';
  }
  formatarCPFInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    // Aplica a máscara
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    event.target.value = value;
    this.novoColaborador.cpf = value;
  }
}