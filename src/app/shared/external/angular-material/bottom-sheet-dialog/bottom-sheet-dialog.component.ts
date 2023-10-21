import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";

export interface BottomSheetDialogData {
  btnLabels: string[];
  btnIcons: string[];
  btnColors: string[];
  btnActions: string[];
}

@Component({
  selector: 'app-bottom-sheet-dialog',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  templateUrl: './bottom-sheet-dialog.component.html',
  styleUrls: ['./bottom-sheet-dialog.component.scss']
})
export class BottomSheetDialogComponent {

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetDialogComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: BottomSheetDialogData) {
  }

  onClick(index: number) {
    this.bottomSheetRef.dismiss({
      action: this.data.btnActions[index]
    });
  }
}
