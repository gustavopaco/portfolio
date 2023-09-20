import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, of, throwError} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {EXPIRED_JWT_EXCEPTION, INVALID_SESSION_EXCEPTION} from "../constants/constants";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly AUTHORIZATION_HEADER = "Authorization";

  constructor(private authService: AuthService,
              // private toastMessageService: ToastMessageService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isUserLogged() && !this.authService.isTempExternalApiRequest()) {
      const authenticatedRequest = request.clone(
        {setHeaders: {AUTHORIZATION_HEADER: this.authService.getFullToken()}}
      );
      return next.handle(authenticatedRequest)
        .pipe(catchError((error: HttpErrorResponse) => this.interceptInvalidToken(error)));
    }
    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => this.interceptErrors(error)));
  }

  interceptInvalidToken(error: HttpErrorResponse) {
    if (error.status === 401 && (error.error?.message === EXPIRED_JWT_EXCEPTION || error.error?.message === INVALID_SESSION_EXCEPTION)) {
      // this.toastMessageService.jwtErrorMessage(EXPIRED_JWT_EXCEPTION_MESSAGE);
      // Note: Estou utilizando o logout em vez de usar o invalidSession pois ao enviar para a pagina de login existe um guarda de rotas que verifica se usuario ja esta logado, entao nesse caso se enviar para uma pagina com guarda de rotas ele ira enviar uma mensagem duplicada de token invalido
      this.authService.logout();
      return of()
    } else {
      this.interceptErrors(error);
    }
    return throwError(() => error);
  }

  interceptErrors(error: HttpErrorResponse) {
    // Note: Removendo tratamento de Erro Global
    // this.toastMessageService.errorMessage(HttpValidator.validateResponseErrorMessage(error))
    return throwError(() => error);
  }
}
