import {Routes} from "@angular/router";
import {PortfolioComponent} from "./portfolio.component";

export const PORTFOLIO_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: PortfolioComponent},
]
