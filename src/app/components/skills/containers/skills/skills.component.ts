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
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {CredentialsService} from "../../../../shared/services/credentials.service";
import {UtilAwsS3Service} from "../../../../shared/services/default/aws/util-aws-s3.service";
import {AwsConfiguration} from "../../../../shared/interface/aws-configuration";
import {AuthService} from "../../../../shared/services/default/auth.service";
import {HttpParams} from "@angular/common/http";
import {BreakpointObserver} from "@angular/cdk/layout";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatBottomSheet, MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {
  BottomSheetDialogComponent
} from "../../../../shared/external/angular-material/bottom-sheet-dialog/bottom-sheet-dialog.component";

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, SkillsListComponent, MatDialogModule, MatBottomSheetModule, TranslateModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {

  isSkillsLoading = true;
  isFailedToLoadSkills = false;
  isSkillSelected = false;

  skillIdSelected = -1;

  skills: Skill[] = [];

  isDesktop = false;

  constructor(private matDialog: MatDialog,
              private authService: AuthService,
              private breakpointObserver: BreakpointObserver,
              private matBottomSheet: MatBottomSheet,
              private userService: UserService,
              private matSnackBarService: MatSnackbarService,
              private translateService: TranslateService,
              private credentialsService: CredentialsService,
              private utilAwsS3Service: UtilAwsS3Service) {
    this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        this.isDesktop = result.matches;
        this.resetSkillSelected();
      });
  }

  ngOnInit(): void {
    this.getSkillRecords();
  }

  private getSkillRecords() {
    this.onRequestLoadingSkills();
    this.userService.getSkillRecords(this.paramsToRequest())
      .pipe(take(1), finalize(() => this.isSkillsLoading = false))
      .subscribe({
        next: (response) => this.skills = response,
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_failed'), 5000);
          this.isFailedToLoadSkills = true;
        }
      })
  }

  private paramsToRequest(): HttpParams {
    return new HttpParams().set('nickname', this.authService.getNickname());
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
    if (!this.isDesktop) {
      this.openBottomSheet();
    }
  }

  private openBottomSheet() {
    const bottomSheetRef = this.matBottomSheet.open(BottomSheetDialogComponent, {
      data: {
        btnLabels: [this.translateService.instant('skills.btn_edit_skill'), this.translateService.instant('skills.btn_delete_skill')],
        btnIcons: ['edit', 'delete'],
        btnActions: ['edit', 'delete'],
      }
    });

    bottomSheetRef.afterDismissed()
      .pipe(take(1))
      .subscribe((result: any) => {
        if (result?.action === 'edit') {
          this.onEditSkill();
        } else if (result?.action === 'delete') {
          this.onDeleteSkill(this.skillIdSelected);
        } else if (result?.action == undefined) {
          this.resetSkillSelected();
        }
      })
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
        this.resetSkillSelected();
      });
  }

  private loadCredentials(skillId: number) {
    this.credentialsService.getAwsCredentials()
      .pipe(take(1))
      .subscribe({
        next: (response: AwsConfiguration) => this.deleteSkillFromAws(skillId, response),
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_failed'), 5000)
      })
  }

  private deleteSkillFromAws(skillId: number, response: AwsConfiguration) {
    this.utilAwsS3Service.loadS3Client(response.region, response.accessKey, response.secretKey);
    this.utilAwsS3Service.deleteImageFromAwsS3Bucket(response.bucketName, this.filterSkillById(skillId).pictureUrl)
      .then(() => this.deleteSkill(skillId))
      .catch(() => this.matSnackBarService.error(this.translateService.instant('generic_messages.failed_to_delete_stored_image'), this.translateService.instant('generic_messages.action_close'), 5000))
  }

  private deleteSkill(skillId: number) {
    this.userService.deleteSkillRecord(skillId)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.matSnackBarService.success(this.translateService.instant('skills.skill_deleted_successfully'), this.translateService.instant('generic_messages.action_close'), 5000);
          this.removeSkillFromList(skillId);
          this.resetSkillSelected();
        },
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), this.translateService.instant('generic_messages.action_failed'), 5000)
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
        this.resetSkillSelected();
        if (result) {
          this.getSkillRecords();
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
