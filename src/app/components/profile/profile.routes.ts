import {Routes} from "@angular/router";
import {ProfileComponent} from "./profile.component";

export const PROFILE_ROUTES: Routes = [
  {path: '', component: ProfileComponent, children: [
      {path: 'skills', pathMatch: 'full', loadChildren: () => import('../skills/skills.routes').then(m => m.SKILLS_ROUTES)},
      {path: 'projects', pathMatch: 'full', loadChildren: () => import('../projects/projects.routes').then(m => m.PROJECTS_ROUTES)},
      {path: 'courses', pathMatch: 'full', loadChildren: () => import('../courses/courses.routes').then(m => m.COURSES_ROUTES)},
      {path: 'certificates', pathMatch: 'full', loadChildren: () => import('../certificates/certificates.routes').then(m => m.CERTIFICATES_ROUTES)},
      {path: 'resume', pathMatch: 'full', loadChildren: () => import('../resume/resume.routes').then(m => m.RESUME_ROUTES)},
    ]},
];
