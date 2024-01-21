import {Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface LoadingDialogData {
  title?: string;
  titleClassColor?: string;
  message?: string;
  messageClassColor?: string;
  timeout?: number;
  mode?: 'spinner' | 'spinner-text' | 'card';
}

@Component({
  selector: 'app-loading-dialog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.scss']
})
export class LoadingDialogComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<LoadingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: LoadingDialogData) {
  }

  ngOnInit(): void {
    this.closeDialogOnTimeout();
  }

  private closeDialogOnTimeout() {
    if (this.data.timeout && this.data?.timeout > 0) {
      setTimeout(() => {
        this.matDialogRef.close();
      }, this.data.timeout);
    }
  }

  setTitleClassColor() {
    return this.data?.titleClassColor ?? '';
  }

  setMessageClassColor() {
    if (this.data?.mode === 'card') {
      return this.data?.messageClassColor ?? '';
    }
    return this.data?.messageClassColor ?? '#FFFFFF';
  }
}
