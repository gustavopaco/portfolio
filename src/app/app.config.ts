import { ApplicationConfig } from '@angular/core';
import {provideRouter} from "@angular/router";
import {APP_ROUTES} from "./app.routes";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
]
};
