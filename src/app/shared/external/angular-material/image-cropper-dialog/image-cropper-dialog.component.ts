import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {Dimensions, ImageCroppedEvent, ImageCropperComponent, ImageCropperModule} from "ngx-image-cropper";
import {MatButtonModule} from "@angular/material/button";

export class ImageCroppedData {
  imageChangedEvent?: any;
  title?: string;
  imageAltText?: string;
  base64?: string;
  file?: File;
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
  returnImageType?: 'base64' | 'file';
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
  croppedImage: any = '';
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent

  constructor(public matDialogRef: MatDialogRef<ImageCropperDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ImageCroppedData) {
  }

  ngOnInit(): void {
    this.imageChangedEvent = this.data.imageChangedEvent;
  }

  onConfirm(): void {
    this.imageCropper.crop();
    if (this.data.returnImageType === 'file') {
      this.matDialogRef.close(this.data.file);
      return;
    }
    this.matDialogRef.close(this.data.base64);
  }

  imageCropped($event: ImageCroppedEvent) {
    this.croppedImage = $event.base64;
  }

  cropperReady($event: Dimensions) {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }
}
