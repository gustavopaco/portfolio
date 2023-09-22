import {Routes} from "@angular/router";
import {LayoutComponent} from "./containers/layout/layout.component";

export const APP_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: LayoutComponent, loadChildren: () => import('./components/auth/auth.routes').then(m => m.AUTHENTICATION_ROUTES)},
  ];
