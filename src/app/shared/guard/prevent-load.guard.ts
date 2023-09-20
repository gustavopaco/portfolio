import {CanMatchFn} from "@angular/router";
import {AUTH_VERIFY_ACCESS_USER, NO_AUTH_VERIFY_ACCESS_USER} from "./auth.guard";

/*Note: Previne que Bundle de codigo seja carregado se usuario nao tem permissao*/
export const AUTH_USER_CAN_MATCH: CanMatchFn = (route, segments) => {
  // todo: Situation: User authenticated trying to access page to load bundle
  return AUTH_VERIFY_ACCESS_USER();
}

export const NO_AUTH_USER_CAN_MATCH: CanMatchFn = (route, segments) => {
  // todo: Situation: User not authenticated trying to access page to load bundle
  return NO_AUTH_VERIFY_ACCESS_USER();
}



