import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageCropperModule} from "ngx-image-cropper";
import {MatButtonModule} from "@angular/material/button";
import {MatSnakebarService} from "../toast-snackbar/mat-snakebar.service";
import {ACTION_CLOSE, FAILED_LOADING_IMAGE} from "../../../constants/constants";

export class ImageCroppedData {
  imageChangedEvent?: any;
  title?: string;
  imageAltText?: string;
  base64?: string;
  file?: File;
  objectUrl?: string;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean = true;
  containWithinAspectRatio?: boolean = false;
  aspectRatio?: number = 1;
  resizeToWidth: number = 0;
  resizeToHeight: number = 0;
  cropperStaticWidth?: number = 0;
  cropperStaticHeight?: number = 0;
  cropperMinWidth?: number = 0;
  cropperMinHeight?: number = 0;
  cropperMaxWidth?: number = 0;
  cropperMaxHeight?: number = 0;
  initialStepSize?: number = 3;
  onlyScaleDown?: boolean = false;
  roundCropper: boolean = false;
  imageQuality: number = 92;
  autoCrop: boolean = false;
  format?: 'png' | 'jpeg' | 'bmp' = 'png';
  hideResizeSquares?: boolean = false;
  canvasRotation?: number = 0;
  disabled?: boolean = false;
  backgroundColor?: string = '#fff';
  allowMoveImage?: boolean = false;
  hidden?: boolean = false;
  cropperPosition?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  returnImageType?: 'base64' | 'blob' = 'blob';
  btnConfirmLabel: string = 'Load';
  btnCancelLabel: string = 'Cancel';
}

@Component({
  selector: 'app-image-cropper-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ImageCropperModule, MatButtonModule],
  templateUrl: './image-cropper-dialog.component.html',
  styleUrls: ['./image-cropper-dialog.component.scss']
})
export class ImageCropperDialogComponent implements OnInit {
  imageChangedEvent: any = '';
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent

  constructor(public matDialogRef: MatDialogRef<ImageCropperDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ImageCroppedData,
              private matSnackBarService: MatSnakebarService) {
  }

  ngOnInit(): void {
    this.imageChangedEvent = this.data.imageChangedEvent;
  }

  onConfirm(): void {
    this.imageCropper.crop();
    this.matDialogRef.close(this.data);
  }

  imageLoaded() {
    // show cropper
  }

  imageCropped($event: ImageCroppedEvent) {
    if (this.data.returnImageType === 'blob') {
      this.data.file = new File([$event.blob!!], this.imageChangedEvent.target.files[0]?.name, {type: $event.blob?.type})
      this.data.objectUrl = $event.objectUrl!!;
    }
    if (this.data.returnImageType === 'base64') {
      this.data.base64 = $event.base64!!;
    }
  }

  cropperReady($event: Dimensions) {
    // cropper ready
  }

  loadImageFailed() {
    // show message and close dialog
    this.matSnackBarService.error(FAILED_LOADING_IMAGE, ACTION_CLOSE);
    this.matDialogRef.close();
  }
}
