import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, of, throwError} from 'rxjs';
import {AuthService} from "../services/default/auth.service";
import {
  EXPIRED_JWT_EXCEPTION,
  EXPIRED_JWT_EXCEPTION_MESSAGE,
  INVALID_SESSION_EXCEPTION_MESSAGE
} from "../constants/constants";
import {MatSnackbarService} from "../external/angular-material/toast-snackbar/mat-snackbar.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private readonly AUTHORIZATION_HEADER = "Authorization";

  constructor(private authService: AuthService,
              private matSnackBarService: MatSnackbarService
              // private toastMessageService: ToastMessageService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isUserLogged() && !this.authService.isTempExternalApiRequest()) {
      const authenticatedRequest = request.clone(
        {setHeaders: {[this.AUTHORIZATION_HEADER] : this.authService.getFullToken()}}
      );
      return next.handle(authenticatedRequest)
        .pipe(catchError((error: HttpErrorResponse) => this.interceptInvalidToken(error)));
    }
    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => this.interceptErrors(error)));
  }

  interceptInvalidToken(error: HttpErrorResponse) {
    if (error.status === 401) {
      if (error.error?.message === EXPIRED_JWT_EXCEPTION) {
        this.matSnackBarService.error(EXPIRED_JWT_EXCEPTION_MESSAGE);
      } else {
        this.matSnackBarService.error(INVALID_SESSION_EXCEPTION_MESSAGE);
      }
      // Note: Estou utilizando o logout em vez de usar o invalidSession pois ao enviar para a pagina de login existe um guarda de rotas que verifica se usuario ja esta logado, entao nesse caso se enviar para uma pagina com guarda de rotas ele ira enviar uma mensagem duplicada de token invalido
      this.authService.invalidateSession();
      return of();
    }
    return throwError(() => error);
  }

  interceptErrors(error: HttpErrorResponse) {
    // Note: Removendo tratamento de Erro Global
    // this.toastMessageService.errorMessage(HttpValidator.validateResponseErrorMessage(error))
    return throwError(() => error);
  }
}
