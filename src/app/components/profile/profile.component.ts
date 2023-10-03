import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {CamelCasePipe} from "../../shared/pipe/camel-case.pipe";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, RouterOutlet, CamelCasePipe, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  links = ['skills', 'projects']
  activeLink = this.links[0]

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.navigate(['skills'], {relativeTo: this.activatedRoute, onSameUrlNavigation: undefined})
  }

  goToRoute(link: string) {
    this.router.navigate([link], {relativeTo: this.activatedRoute, onSameUrlNavigation: undefined})
  }
}
