import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Skill} from "../../../../shared/interface/skill";
import {SkillsFormComponent} from "../skills-form/skills-form.component";
import {finalize, take} from "rxjs";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SkillsListComponent} from "../../components/skill-list/skills-list.component";
import {HttpValidator} from "../../../../shared/validator/http-validator";
import {UserService} from "../../../../shared/services/user.service";
import {MatSnackbarService} from "../../../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, SkillsListComponent, MatDialogModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  isSkillsLoading = true;
  isSkillsError = false;
  isSkillSelected = false;

  skillIdSelected = -1;

  skills: Skill[] = [];

  constructor(private matDialog: MatDialog,
              private userService: UserService,
              private matSnackBarService: MatSnackbarService) {
  }

  ngOnInit(): void {
    this.getSkillRecords();
  }

  private getSkillRecords() {
    this.userService.getSkillRecords()
      .pipe(take(1), finalize(() => this.isSkillsLoading = false))
      .subscribe({
        next: (response) => this.skills = response,
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), 'Failed', 5000);
          this.isSkillsError = true;
        }
      })
  }

  onAddSkill() {
    this.openSkillFormDialog(true);
  }

  onSelectedSkill(skillId: any) {
    if (skillId === -1) {
      this.resetSkillSelected();
      return;
    }
    this.setSkillSelected(skillId);
  }

  onEditSkill() {
    const skill = this.filterSkillById(this.skillIdSelected);
    this.openSkillFormDialog(false, skill);
  }

  onDeleteSkill(skillId: number) {
    console.log("Chamou o delete para o id: " + skillId)
  }

  private openSkillFormDialog(newSkillResult: boolean, skillOnEdit?: Skill) {
    const dialogRef = this.matDialog.open(SkillsFormComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '600px',
      maxHeight: '700px',
      enterAnimationDuration: 200,
      disableClose: false,
      data: {
        newSkill: newSkillResult,
        skillToEdit: skillOnEdit
      }
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this.getSkillRecords();
          this.resetSkillSelected();
        }
      });
  }

  private filterSkillById(skillId: number) {
    return this.skills.filter(skill => skill.id === skillId)[0];
  }

  private resetSkillSelected() {
    this.isSkillSelected = false;
    this.skillIdSelected = -1;
  }

  private setSkillSelected(skillId: number) {
    this.isSkillSelected = true;
    this.skillIdSelected = skillId;
  }
}
