import {ProjectSectionBlock} from "./project-section-block";

export interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  pictureUrl: string;
  pictureOrientation: string;
  status: string;
  tags: string[];
  projectSectionBlocks: ProjectSectionBlock[];
}
