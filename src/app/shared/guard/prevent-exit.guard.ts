import {CanDeactivateFn} from "@angular/router";
import {IrouteCanDeactivate} from "../interface/iroute-can-deactivate";

/*Note: Guarda responsavel por perguntar se usuario realmente deseja sair da Pagina*/
export const FORM_DEACTIVATE_FN: CanDeactivateFn<IrouteCanDeactivate> = (component, route, state, nextState) => {
  // todo: Situation: User trying to leave page
  //  Implement interface IrouteCanDeactivate in component and implement method canDeactivate, case true return true, else return false
    return component.canDeactivate();
  }
