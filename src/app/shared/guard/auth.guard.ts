import {ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, RouterStateSnapshot} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../services/default/auth.service";

/*Note: Guarda responsavel por verificar se usuario tem permissao/ou/Logado para poder abrir a pagina*/
export const CAN_ACTIVATE_USER_AUTH: CanActivateFn = (route, state) => {

  return AUTH_VERIFY_ACCESS_USER();
}

export const CAN_ACTIVATE_USER_NO_AUTH: CanActivateFn = (route, state) => {
  return NO_AUTH_VERIFY_ACCESS_USER();
}

/*Note: Guarda responsavel por verificar se usuario tem permissao/ou/Logado para poder abrir as paginas filhas*/
export const CAN_ACTIVATE_CHILD_USER_AUTH: CanActivateChildFn = (route, state) => {
  return AUTH_VERIFY_ACCESS_USER();
}

export const CAN_ACTIVATE_CHILD_USER_NO_AUTH: CanActivateChildFn = (route, state) => {
  return NO_AUTH_VERIFY_ACCESS_USER();
}

export const CAN_ACTIVATE_EMPRESA_NO_OWNER: CanActivateFn = (route: ActivatedRouteSnapshot, segments: RouterStateSnapshot) => {
  return NO_OWNER_VERIFY_ACCESS(route, segments);
}

export const CAN_ACTIVATE_CHILD_EMPRESA_NO_OWNER: CanActivateFn = (route: ActivatedRouteSnapshot, segments: RouterStateSnapshot) => {
  return NO_OWNER_VERIFY_ACCESS(route, segments);
}

/*Note: É uma constante que tambem é um metodo com retorno boolean*/
export const AUTH_VERIFY_ACCESS_USER = (): boolean => {
  // todo: Situation: User trying to access a page that requires authentication
  //  Inject service and verify if user is logged, case logged return true, else redirect to login page and return false
  const authService = inject(AuthService);
  if (authService.isUserLogged()) {
    return true;
  }
  authService.redirectToLogin();
  return false;
}

export const NO_AUTH_VERIFY_ACCESS_USER = (): boolean => {
  // todo: Situation: User logged trying to access a page that does not require authentication like login page
  //  Inject service and verify if user is logged, case logged redirect to home page and return false, else return true
  const authService = inject(AuthService);
  if (authService.isUserLogged()) {
    authService.redirectToHome();
    return false;
  }
  return true;
}

export const NO_OWNER_VERIFY_ACCESS = (route: ActivatedRouteSnapshot, segments: RouterStateSnapshot): boolean => {
  // todo: Situation: User logged trying to access url of user that is not owner
  //  Inject service and verify if user is logged and has role to access page and if localstorage id is equal to id of url, case true return true, else redirect to home page and return false
  return true;
}
