import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Pedidos } from './pedidos/pedidos';
import { Login } from './login/login';
import { Reportes } from './reportes/reportes';
import { Catalogo } from './catalogo/catalogo';
import { Sucursal } from './sucursal/sucursal';
import { MsalGuard } from '@azure/msal-angular';
import { Operador } from './operador/operador';
import { HomeOperador } from './home-operador/home-operador';

import { authGuard } from './guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },

  {
    path: 'login',
    component: Login,
  },

  {
  path: 'pedidos',
  component: Pedidos,
  canActivate: [MsalGuard],
},

  {
  path: 'reportes',
  redirectTo: '',
 },

 {
  path: 'catalogo',
  redirectTo: '',
 },

  {
  path: 'sucursal',
  redirectTo: '',
 },
 {
  path: 'operador/inicio',
  component: HomeOperador,
  canActivate: [MsalGuard],
},

  {
    path: 'operador',
    component: Operador,
    canActivate: [MsalGuard],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
