import {Routes} from "@angular/router";
import {LayoutComponent} from "./containers/layout/layout.component";
import {AUTH_USER_CAN_MATCH, NO_AUTH_USER_CAN_MATCH} from "./shared/guard/prevent-load.guard";
import {ErrorComponent} from "./components/error/error.component";
import {environment} from "../environments/environment";

export const APP_ROUTES: Routes = [
  {path: '', pathMatch: 'full', redirectTo: `portfolio/${environment.OWNER_NICKNAME}`},
  {path: 'portfolio/:nickname', pathMatch: 'full', component: LayoutComponent, loadChildren: () => import('./components/portfolio/portfolio.routes').then(m => m.PORTFOLIO_ROUTES)},
  {path: 'auth', pathMatch: 'full', canMatch:[NO_AUTH_USER_CAN_MATCH], component: LayoutComponent, loadChildren: () => import('./components/auth/auth.routes').then(m => m.AUTHENTICATION_ROUTES)},
  {path: 'profile', canMatch: [AUTH_USER_CAN_MATCH], component: LayoutComponent, loadChildren: () => import('./components/profile/profile.routes').then(m => m.PROFILE_ROUTES)},
  {path: 'not-found', component: ErrorComponent},
  {path: 'error', component: ErrorComponent},
  {path: '**', redirectTo: 'not-found'}
  ];
