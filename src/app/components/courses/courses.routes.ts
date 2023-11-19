import {Routes} from "@angular/router";
import {CoursesComponent} from "./containers/courses/courses.component";

export const COURSES_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: CoursesComponent}
]
