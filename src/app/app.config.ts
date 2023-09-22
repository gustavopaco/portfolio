import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from "@angular/router";
import {APP_ROUTES} from "./app.routes";
import {provideAnimations} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TokenInterceptor} from "./shared/interceptor/token.interceptor";
import {MatSnackBarModule} from "@angular/material/snack-bar";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

export const TRANSLATE_CONFIG = {
  defaultLanguage: 'en',
  loader : {
    provide: TranslateLoader,
    useFactory: (createTranslateLoader),
    deps: [HttpClient]
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(TranslateModule.forRoot(TRANSLATE_CONFIG), MatSnackBarModule),
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ]
};
