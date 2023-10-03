import {Routes} from "@angular/router";
import {ProfileComponent} from "./profile.component";

export const PROFILE_ROUTES: Routes = [
  {path: '', component: ProfileComponent, children: [
      {path: 'skills', pathMatch: 'full', loadChildren: () => import('../skills/skills.routes').then(m => m.SKILLS_ROUTES)},
      {path: 'projects', pathMatch: 'full', loadChildren: () => import('../projects/projects.routes').then(m => m.PROJECTS_ROUTES)},
    ]},
];
