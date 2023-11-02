import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Project} from "../../../../shared/interface/project";
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatToolbarModule} from "@angular/material/toolbar";
import {StatusProjectPipe} from "../../../../shared/pipe/status-project.pipe";
import {getRibbonClass} from "../../../../shared/utils/project-status-to-ribbon-class";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {
  ConfirmationDialogComponent
} from "../../../../shared/external/angular-material/confirmation-dialog/confirmation-dialog.component";
import {take} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {BreakpointObserver} from "@angular/cdk/layout";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatBottomSheet, MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {
  BottomSheetDialogComponent
} from "../../../../shared/external/angular-material/bottom-sheet-dialog/bottom-sheet-dialog.component";
import {MatTooltipModule} from "@angular/material/tooltip";

export interface ProjectItemData {
  project: Project;
  editable: boolean;
}

@Component({
  selector: 'app-projects-item',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatDialogModule, StatusProjectPipe, MatButtonModule, MatIconModule, MatBottomSheetModule, MatTooltipModule],
  templateUrl: './projects-item.component.html',
  styleUrls: ['./projects-item.component.scss']
})
export class ProjectsItemComponent {

  isDesktop = false;

  constructor(private matDialogRef: MatDialogRef<ProjectsItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProjectItemData,
              private matDialog: MatDialog,
              private breakpointObserver: BreakpointObserver,
              private matBottomSheet: MatBottomSheet,
              private translateService: TranslateService) {
    this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        this.isDesktop = result.matches;
      });
  }

  setProjectImage() {
    if (this.data.project.pictureUrl) {
      return this.data.project.pictureUrl;
    }
    return 'assets/backgrounds/under-construction.jpg';
  }

  setRibbonColor() {
    return getRibbonClass(this.data.project.status);
  }

  onEdit() {
    this.matDialogRef.close({action: 'edit', project: this.data.project});
  }

  onDelete() {
    this.openConfirmationDialog();
  }

  private openConfirmationDialog() {
    const matDialogRef = this.matDialog.open(ConfirmationDialogComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '400px',
      maxHeight: '700px',
      disableClose: true,
      data: {
        title: this.translateService.instant('deleteProjectTitle'),
        message: this.translateService.instant('deleteProjectMessage', {projectName: this.data.project.name}),
        btnConfirmLabel: this.translateService.instant('deleteButton'),
        confirmColor: 'warn',
        confirmIcon: 'delete',
        btnCancelLabel: this.translateService.instant('cancelButton'),
        cancelColor: 'primary'
      }
    })

    matDialogRef.afterClosed()
      .pipe(take(1))
      .subscribe((result: boolean) => {
        if (result) {
          this.matDialogRef.close({action: 'delete', project: this.data.project});
        }
      })
  }

  private setBottomSheetData() {
    if (this.data.editable) {
      return {
        btnLabels: ['Visit site', 'Edit project', 'Delete project'],
        btnIcons: ['launch', 'edit', 'delete'],
        btnActions: ['visit', 'edit', 'delete'],
        links: [this.data.project.url, '#', '#']
      }
    } else {
      return {
        btnLabels: ['Visit site'],
        btnIcons: ['launch'],
        btnActions: ['visit'],
        links: [this.data.project.url]
      }
    }
  }

  onOptionsClick() {
    const bottomSheetRef = this.matBottomSheet.open(BottomSheetDialogComponent, {
      data: this.setBottomSheetData()
    });

    bottomSheetRef.afterDismissed()
      .pipe(take(1))
      .subscribe((result: any) => {
        if (result?.action === 'edit') {
          this.onEdit();
        } else if (result?.action === 'delete') {
          this.onDelete();
        }
      })
  }
}
