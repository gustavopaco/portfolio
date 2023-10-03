import {Routes} from "@angular/router";
import {SkillsComponent} from "./containers/skills/skills.component";

export const SKILLS_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: SkillsComponent}
]
