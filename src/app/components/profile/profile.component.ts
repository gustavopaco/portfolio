import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "../../shared/services/user.service";
import {take} from "rxjs";
import {MatSnakebarService} from "../../shared/external/angular-material/toast-snackbar/mat-snakebar.service";
import {HttpValidator} from "../../shared/validator/http-validator";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {SkillsListComponent} from "../skills/components/skill-list/skills-list.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {User} from "../../shared/interface/user";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {SkillsFormComponent} from "../skills/containers/skills-form/skills-form.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTabsModule, SkillsListComponent, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isSkillSelected = false;
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

  private getSkillRecords() {
    this.userService.getSkillRecords()
      .pipe(take(1))
      .subscribe({
        next: (response) => this.user!!.skills = response,
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), 'Failed', 5000)
      })
  }

  onEditSkill(skillId: any) {
    this.validateSkillSelected(skillId);
    // todo: implementar a edição de skill
  }

  onDeleteSkill(skillId: number) {
    this.validateSkillSelected(skillId);
  }

  onAddSkill() {
    const dialogRef = this.matDialog.open(SkillsFormComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '600px',
      maxHeight: '700px',
      enterAnimationDuration: 200,
      disableClose: false,
      data: {
        newSkill: true
      }
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result : boolean) => {
        if (result) this.getSkillRecords();
      });
  }

  private validateSkillSelected(skillId: number) {
    if (skillId === -1) {
      this.isSkillSelected = false;
      return;
    }
    this.isSkillSelected = true;
  }
}
