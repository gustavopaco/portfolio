import {Skill} from "./skill";
import {Project} from "./project";

export interface User {
  id: number;
  urlPicture: string;
  skills: Skill[];
  projects: Project[];
}
