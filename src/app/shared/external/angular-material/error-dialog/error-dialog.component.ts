import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './error-dialog.component.html',
  styleUrls: [ './error-dialog.scss'
  ]
})
export class ErrorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public message: string) {}
}
