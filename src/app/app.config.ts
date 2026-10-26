import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalGuardConfiguration,
} from '@azure/msal-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth-interceptor';

import { msalConfig, loginRequest } from './operador/auth/auth-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // Conservamos temporalmente el interceptor existente.
    provideHttpClient(withInterceptors([authInterceptor])),

    // Instancia de Microsoft Authentication Library.
    {
      provide: MSAL_INSTANCE,
      useFactory: () => new PublicClientApplication(msalConfig),
    },

    // Configuración del guard para el futuro módulo Operador.
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Redirect,
        authRequest: loginRequest,
      } as MsalGuardConfiguration,
    },

    MsalService,
    MsalGuard,
    MsalBroadcastService,

    // Inicializa MSAL y procesa el retorno del inicio de sesión.
    provideAppInitializer(() => {
      const msal = inject(MsalService);

      return firstValueFrom(msal.handleRedirectObservable()).then((result) => {
        const account = result?.account ?? msal.instance.getAllAccounts()[0];

        if (account) {
          msal.instance.setActiveAccount(account);
        }
      });
    }),
  ],
};
