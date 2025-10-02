import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CafeManha, CafeManhaRequest, ItemCafeManhaResponse } from '../../models/cafe-manha.model'; 
import { CafeManhaService } from '../../services/cafe-manha.service';

@Component({
  selector: 'app-cafe-manha-list',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './cafe-manha-list.component.html',
  styleUrl: './cafe-manha-list.component.css'
})
export class CafeManhaListComponent implements OnInit {
  // Dados
  cafes: CafeManha[] = [];
  cafeSelecionado: CafeManha | null = null;
  
  // Estados da UI
  mostrarFormCriar = false;
  mostrarFormEditar = false;
  mensagem: string = '';
  tipoMensagem: 'success' | 'error' | 'info' = 'info';
  carregando: boolean = false;

  // Forms
  novoCafe: CafeManhaRequest = { data: '' };
  cafeEditando: CafeManhaRequest = { data: '' };
  idEditando: number | null = null;

  constructor(private cafeManhaService: CafeManhaService) { }

  ngOnInit(): void {
    this.carregarCafes();
  }

  carregarCafes(): void {
    this.carregando = true;
    this.cafeManhaService.listarCafes().subscribe({
      next: (cafes) => {
        this.cafes = cafes;
        this.carregando = false;
      },
      error: (error) => {
        this.carregando = false;
      }
    });
  }

  selecionarCafe(cafe: CafeManha): void {
    this.cafeSelecionado = cafe;
  }

  // CRIAÇÃO
  abrirFormCriar(): void {
    this.mostrarFormCriar = true;
    this.mostrarFormEditar = false;
    this.novoCafe = { data: '' };
    this.limparMensagem();
  }

  criarCafe(): void {
    if (!this.validarData(this.novoCafe.data)) {
      this.mostrarMensagem('Data inválida! Use o formato DD-MM-YYYY', 'error');
      return;
    }

    this.carregando = true;
    this.cafeManhaService.criarCafeManha(this.novoCafe).subscribe({
      next: (cafeCriado) => {
        this.mostrarMensagem(`Café criado para ${this.novoCafe.data}!`, 'success');
        this.carregarCafes();
        this.fecharForms();
        this.carregando = false;
      },
      error: (error) => {
        this.mostrarMensagem('Erro ao criar café: ' + error.error?.message, 'error');
        this.carregando = false;
      }
    });
  }

  // EDIÇÃO
  abrirFormEditar(cafe: CafeManha): void {
    this.mostrarFormEditar = true;
    this.mostrarFormCriar = false;
    this.cafeEditando = { data: cafe.data };
    this.idEditando = cafe.id;
    this.limparMensagem();
  }

  atualizarCafe(): void {
    if (!this.idEditando || !this.validarData(this.cafeEditando.data)) {
      this.mostrarMensagem('Dados inválidos para atualização', 'error');
      return;
    }

    this.carregando = true;
    this.cafeManhaService.atualizarCafeManha(this.idEditando, this.cafeEditando).subscribe({
      next: (cafeAtualizado) => {
        this.mostrarMensagem('Café atualizado com sucesso!', 'success');
        this.carregarCafes();
        this.fecharForms();
        this.carregando = false;
      },
      error: (error) => {
        this.mostrarMensagem('Erro ao atualizar café: ' + error.error?.message, 'error');
        this.carregando = false;
      }
    });
  }

  // EXCLUSÃO
  deletarCafe(id: number): void {
    if (confirm('Tem certeza que deseja excluir este café?')) {
      this.carregando = true;
      this.cafeManhaService.deletarCafeManha(id).subscribe({
        next: () => {
          this.mostrarMensagem('Café excluído com sucesso!', 'success');
          this.carregarCafes();
          this.cafeSelecionado = null;
          this.carregando = false;
        },
        error: (error) => {
          this.mostrarMensagem('Erro ao excluir café', 'error');
          this.carregando = false;
        }
      });
    }
  }

  // UTILITÁRIOS
  validarData(data: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(data)) return false;
    const date = new Date(data);
    return date instanceof Date && !isNaN(date.getTime());
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
}