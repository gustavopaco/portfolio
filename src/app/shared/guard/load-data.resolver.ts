import {ResolveFn} from "@angular/router";


/*Note: Guarda responsavel por carregar dados antes da pagina abrir*/
export const LOAD_OBJECT: ResolveFn<any|undefined> = (route, state) => {
  // todo: Situation: Load data before page open
  //  Verify if route has params and if params has attribute [id], case true inject service and return data, else return undefined
  return undefined;
}
