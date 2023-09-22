import {Routes} from "@angular/router";
import {AuthComponent} from "./auth.component";

export const AUTHENTICATION_ROUTES: Routes = [
  {path: '', component: AuthComponent, pathMatch: 'full'}
];
