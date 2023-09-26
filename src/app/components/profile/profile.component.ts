import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "../../shared/services/user.service";
import {take} from "rxjs";
import {MatSnakebarService} from "../../shared/external/angular-material/toast-snackbar/mat-snakebar.service";
import {HttpValidator} from "../../shared/validator/http-validator";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {SkillComponent} from "../skills/components/skill-list/skills-list.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {User} from "../../shared/interface/user";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {SkillsFormComponent} from "../skills/containers/skills-form/skills-form.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, SkillComponent, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isEditable = false;
  user?: User;

  constructor(private userService: UserService,
              private matSnackBarService: MatSnakebarService,
              private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.getUserRecords();
  }

  private getUserRecords() {
    this.userService.getUserRecords()
      .pipe(take(1))
      .subscribe({
        next: (response) => this.user = response,
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), 'Failed', 5000)
      })
  }

  onEditSkill(skillId: any) {
    if (skillId === -1) {
      this.isEditable = false;
      return;
    }
    this.isEditable = true;
    // todo: implementar a edição de skill
  }

  onDeleteSkill(skillId: number) {

  }

  onAddSkill() {
    this.matDialog.open(SkillsFormComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '600px',
      maxHeight: '600px',
      enterAnimationDuration: 200,
      disableClose: false,
    })
  }
}
