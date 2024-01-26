import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageCropperModule, LoadedImage} from "ngx-image-cropper";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackbarService} from "../toast-snackbar/mat-snackbar.service";
import {ACTION_CLOSE, FAILED_LOADING_IMAGE} from "../../../constants/constants";

export interface ImageCroppedData {
  imageChangedEvent?: any;
  title?: string;
  imageAltText?: string;
  base64?: string;
  file?: File;
  objectUrl?: string;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  containWithinAspectRatio?: boolean;
  aspectRatio?: number;
  resizeToWidth?: number;
  resizeToHeight?: number;
  cropperStaticWidth?: number;
  cropperStaticHeight?: number;
  cropperMinWidth?: number;
  cropperMinHeight?: number;
  cropperMaxWidth?: number;
  cropperMaxHeight?: number;
  initialStepSize?: number;
  onlyScaleDown?: boolean;
  roundCropper?: boolean;
  imageQuality?: number;
  autoCrop?: boolean;
  format?: string;
  hideResizeSquares?: boolean;
  canvasRotation?: number;
  disabled?: boolean;
  backgroundColor?: string;
  allowMoveImage?: boolean;
  hidden?: boolean;
  cropperPosition?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  returnImageType?: string;
  btnConfirmLabel?: string;
  btnCancelLabel?: string;
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
              private matSnackBarService: MatSnackbarService) {
  }

  ngOnInit(): void {
    this.imageChangedEvent = this.data.imageChangedEvent;
  }

  onConfirm(): void {
    this.imageCropper.crop();
  }

  imageLoaded($event: LoadedImage) {
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
    this.matDialogRef.close(this.data);
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
