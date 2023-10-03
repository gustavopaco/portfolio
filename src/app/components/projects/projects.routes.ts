import {Routes} from "@angular/router";
import {ProjectsComponent} from "./containers/projects/projects.component";

export const PROJECTS_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: ProjectsComponent}
]
