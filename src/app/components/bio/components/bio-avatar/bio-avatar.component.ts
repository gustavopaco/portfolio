import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDialog, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {
  ImageCroppedData,
  ImageCropperDialogComponent
} from "../../../../shared/external/angular-material/image-cropper-dialog/image-cropper-dialog.component";
import {finalize, take} from "rxjs";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-bio-avatar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatToolbarModule, MatDialogModule, MatInputModule],
  templateUrl: './bio-avatar.component.html',
  styleUrls: ['./bio-avatar.component.scss']
})
export class BioAvatarComponent {

  @Input() avatarUrl?: string;
  @Output() changedFile = new EventEmitter<File>();

  constructor(private matDialog: MatDialog) {
  }

  onFileInputChange($event: Event) {
    this.openImageCropperDialog($event);
  }

  private openImageCropperDialog($event: Event) {
    const dialogRef: MatDialogRef<ImageCropperDialogComponent>= this.matDialog.open(ImageCropperDialogComponent, {
      width: '100%',
      height: 'auto',
      maxWidth: '700px',
      maxHeight: '700px',
      data: {
        imageChangedEvent: $event,
        returnImageType: 'blob',
        title: 'Project image',
        resizeToWidth: 150,
        resizeToHeight: 150,
        roundCropper: true
      }
    });

    dialogRef.afterClosed()
      .pipe(
        take(1),
        finalize(() => ($event.target as HTMLInputElement).value = '')
      )
      .subscribe((data : ImageCroppedData | undefined) => {
      if (data?.returnImageType === 'blob' && data?.objectUrl) {
        this.avatarUrl = data.objectUrl;
        this.changedFile.emit(data.file);
      }
    })
  }
}
