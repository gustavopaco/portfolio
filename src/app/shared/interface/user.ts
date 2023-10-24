import {Skill} from "./skill";
import {Project} from "./project";
import {Bio} from "./bio";
import {Social} from "./social";

export interface User {
  id: number;
  skills: Skill[];
  projects: Project[];
  bio: Bio;
  social: Social;
}
