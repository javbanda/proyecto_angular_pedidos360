import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Pedidos } from './pedidos/pedidos';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'pedidos', component: Pedidos },
  { path: '**', redirectTo: '' },
];