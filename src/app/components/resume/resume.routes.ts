import {Routes} from "@angular/router";
import {ResumeComponent} from "./containers/resume/resume.component";

export const RESUME_ROUTES: Routes = [
  { path: '', pathMatch: "full", component: ResumeComponent }
  ]
