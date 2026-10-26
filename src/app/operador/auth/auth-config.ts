import { BrowserCacheLocation, Configuration } from '@azure/msal-browser';

// Identificadores de nuestras aplicaciones en Microsoft Entra ID.
const CLIENT_ID = 'd106b7ae-db5d-4c3e-b6f7-cba84f0e4a92';
const TENANT_ID = 'd33558fa-62a4-47d5-a18f-9dcea84b256d';

// Permiso delegado expuesto por pedidos360-backend.
export const apiScope = 'api://2fe9b947-2cc5-4abd-af2b-cde0d32cb25d/access-all';

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200',
  },
  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
  },
};

export const loginRequest = {
  scopes: [apiScope],
};
