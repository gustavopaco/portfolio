import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {ThemePalette} from "@angular/material/core";
import {MatIconModule} from "@angular/material/icon";

export interface ConfirmationDialogData {
  title: string;
  message: string;
  btnConfirmLabel?: string ;
  confirmColor?: ThemePalette;
  confirmIcon?: string;
  btnCancelLabel?: string;
  cancelColor?: ThemePalette;
  cancelIcon?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
  }

  onConfirm(result: boolean): void {
    this.dialogRef.close(result);
  }
}
