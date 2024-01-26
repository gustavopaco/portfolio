import {Skill} from "./skill";
import {Project} from "./project";
import {Bio} from "./bio";
import {Social} from "./social";
import {Course} from "./course";
import {Certificate} from "./certificate";
import {Resume} from "./resume";

export interface User {
  id: number;
  skills: Skill[];
  projects: Project[];
  bio: Bio;
  social: Social;
  courses: Course[];
  certificates: Certificate[];
  resume: Resume;
}
