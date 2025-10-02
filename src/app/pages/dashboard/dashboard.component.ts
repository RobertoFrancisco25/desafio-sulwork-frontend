import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CafeManhaService } from '../../services/cafe-manha.service';
import { ColaboradorService } from '../../services/colaborador.service';
import { ItemCafeManhaService } from '../../services/item-cafe-manha.service';
import { CafeManha } from '../../models/cafe-manha.model';
import { Colaborador } from '../../models/colaborador.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Estatísticas
  totalCafes: number = 0;
  totalColaboradores: number = 0;
  totalItensHoje: number = 0;
  itensTrazidosHoje: number = 0;
  
  // Dados recentes
  cafesRecentes: CafeManha[] = [];
  colaboradoresRecentes: Colaborador[] = [];
  itensRecentes: any[] = [];
  
  // Estados
  carregando: boolean = false;

  constructor(
    private cafeService: CafeManhaService,
    private colaboradorService: ColaboradorService,
    private itemService: ItemCafeManhaService
  ) { }

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {
    this.carregando = true;
    
    // Carregar cafés
    this.cafeService.listarCafes().subscribe({
      next: (cafes) => {
        this.totalCafes = cafes.length;
        this.cafesRecentes = cafes.slice(-5).reverse();
      }
    });

    // Carregar colaboradores
    this.colaboradorService.listarColaboradores().subscribe({
      next: (colaboradores) => {
        this.totalColaboradores = colaboradores.length;
        this.colaboradoresRecentes = colaboradores.slice(-5).reverse();
      }
    });

    // Carregar itens de hoje
    const hoje = new Date().toISOString().split('T')[0];
    this.itemService.listarItensPorData(hoje).subscribe({
      next: (itens) => {
        this.totalItensHoje = itens.length;
        this.itensTrazidosHoje = itens.filter(item => item.trouxeItem).length;
        this.itensRecentes = itens.slice(-5).reverse();
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
      }
    });
  }

  calcularProgresso(): number {
    if (this.totalItensHoje === 0) return 0;
    return (this.itensTrazidosHoje / this.totalItensHoje) * 100;
  }
 
}