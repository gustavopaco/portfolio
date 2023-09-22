import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UiService} from "../../shared/services/ui.service";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private uiService: UiService) {
  }

  ngOnInit(): void {
    this.loadUiConfiguration();
  }

  private loadUiConfiguration() {
    setTimeout(() => {
      this.uiService.showNavBar(false);
      this.uiService.showFooter(false);
    });
  }
}
