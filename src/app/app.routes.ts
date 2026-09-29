import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Pedidos } from './pedidos/pedidos';
import { Login } from './login/login';
import { Reportes } from './reportes/reportes';
import { Catalogo } from './catalogo/catalogo';
import { Sucursal } from './sucursal/sucursal';

import { authGuard } from './guard/auth-guard';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'pedidos',
    component: Pedidos,
    canActivate: [authGuard]
  },

  {
    path: 'reportes',
    component: Reportes,
    canActivate: [authGuard]
  },

  {
    path: 'catalogo',
    component: Catalogo,
    canActivate: [authGuard]
  },

  {
    path: 'sucursal',
    component: Sucursal,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];