import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';

import { serverRoutes } from './app.routes.server';
import { ServerContentInterceptor } from './server-content.interceptor';

const serverAppConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: HTTP_INTERCEPTORS, useClass: ServerContentInterceptor, multi: true },
  ],
};

export const serverConfig = mergeApplicationConfig(appConfig, serverAppConfig);
