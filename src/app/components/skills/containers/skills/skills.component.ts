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
import {
  ConfirmationDialogComponent
} from "../../../../shared/external/angular-material/confirmation-dialog/confirmation-dialog.component";
import {TranslateService} from "@ngx-translate/core";
import {CredentialsService} from "../../../../shared/services/credentials.service";
import {UtilAwsS3Service} from "../../../../shared/services/default/aws/util-aws-s3.service";
import {AwsConfiguration} from "../../../../shared/interface/aws-configuration";
import {ACTION_CLOSE, FAILED_TO_DELETE_SKILL_IMAGE, SKILL_DELETED_SUCCESSFULLY} from "../../../../shared/constants/constants";

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, SkillsListComponent, MatDialogModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  isSkillsLoading = true;
  isFailedToLoadSkills = false;
  isSkillSelected = false;

  skillIdSelected = -1;

  skills: Skill[] = [];

  constructor(private matDialog: MatDialog,
              private userService: UserService,
              private matSnackBarService: MatSnackbarService,
              private translateService: TranslateService,
              private credentialsService: CredentialsService,
              private utilAwsS3Service: UtilAwsS3Service) {
  }

  ngOnInit(): void {
    this.getSkillRecords();
  }

  private getSkillRecords() {
    this.onRequestLoadingSkills();
    this.userService.getSkillRecords()
      .pipe(take(1), finalize(() => this.isSkillsLoading = false))
      .subscribe({
        next: (response) => this.skills = response,
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), 'Failed', 5000);
          this.isFailedToLoadSkills = true;
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
    this.openConfirmDeleteDialog(skillId);
  }

  private openConfirmDeleteDialog(skillId: number) {
    const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '400px',
      maxHeight: '700px',
      disableClose: true,
      data: {
        title: this.translateService.instant('deleteSkillTitle'),
        message: this.translateService.instant('deleteSkillMessage', {skillName: this.filterSkillById(skillId).name}),
        btnConfirmLabel: this.translateService.instant('deleteButton'),
        confirmColor: 'warn',
        confirmIcon: 'delete',
        btnCancelLabel: this.translateService.instant('cancelButton'),
        cancelColor: 'primary'
      }
    });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this.loadCredentials(skillId);
        }
      });
  }

  private loadCredentials(skillId: number) {
    this.credentialsService.getAwsCredentials()
      .pipe(take(1))
      .subscribe({
        next: (response: AwsConfiguration) => this.deleteSkillFromAws(skillId, response),
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), 'Failed', 5000)
      })
  }

  private deleteSkillFromAws(skillId: number, response: AwsConfiguration) {
    this.utilAwsS3Service.loadS3Client(response.region, response.accessKey, response.secretKey);
    this.utilAwsS3Service.deleteImageFromAwsS3Bucket(response.bucketName, this.filterSkillById(skillId).pictureUrl)
      .then(() => this.deleteSkill(skillId))
      .catch(() => this.matSnackBarService.error(FAILED_TO_DELETE_SKILL_IMAGE, ACTION_CLOSE, 5000))
  }

  private deleteSkill(skillId: number) {
    this.userService.deleteSkillRecord(skillId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.matSnackBarService.success(SKILL_DELETED_SUCCESSFULLY, ACTION_CLOSE, 5000);
          this.removeSkillFromList(skillId);
          this.resetSkillSelected();
        },
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), 'Failed', 5000)
      })
  }

  private removeSkillFromList(skillId: number) {
    this.skills = this.skills.filter(skill => skill.id !== skillId);
  }

  private openSkillFormDialog(newSkillResult: boolean, skillOnEdit?: Skill) {
    const dialogRef = this.matDialog.open(SkillsFormComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '600px',
      maxHeight: '700px',
      enterAnimationDuration: 200,
      disableClose: false,
      autoFocus: false,
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

  private onRequestLoadingSkills() {
    this.isSkillsLoading = true;
    this.isFailedToLoadSkills = false;
  }
}
