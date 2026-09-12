import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Pedidos } from './pedidos/pedidos';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'pedidos', component: Pedidos },
  { path: '**', redirectTo: '' },
];