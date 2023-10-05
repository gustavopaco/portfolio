import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectsListComponent} from "../../components/projects-list/projects-list.component";

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectsListComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit{
  ngOnInit(): void {
    console.log("Inicializou o projects")
  }
}
