import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

import { provideRouter } from '@angular/router';
import { serverRoutes } from './app.routes.server';


const serverAppConfig: ApplicationConfig = {
  providers: [provideServerRendering(), provideRouter(serverRoutes)],
};

export const serverConfig = mergeApplicationConfig(appConfig, serverAppConfig);