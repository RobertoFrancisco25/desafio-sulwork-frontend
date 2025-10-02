import { Routes } from '@angular/router';

// ✅ CORRIGIR OS IMPORTS - adicionar .component
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CafeManhaListComponent } from './components/cafe-manha-list/cafe-manha-list.component';
import { ColaboradorListComponent } from './components/colaborador-list/colaborador-list.component';
import { ItemCafeManhaListComponent } from './components/item-cafe-manha-list/item-cafe-manha-list.component';

// ✅ ADICIONAR export
export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'cafes', component: CafeManhaListComponent },
  { path: 'colaboradores', component: ColaboradorListComponent },
  { path: 'itens', component: ItemCafeManhaListComponent },
  { path: '**', redirectTo: '' }
];