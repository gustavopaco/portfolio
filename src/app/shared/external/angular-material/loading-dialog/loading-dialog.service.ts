import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {LoadingDialogComponent, LoadingDialogData} from "./loading-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class LoadingDialogService {

  constructor(private matDialog: MatDialog) {
  }

  openLoadingDialog(loadingDialogData: LoadingDialogData) {
    if (loadingDialogData?.mode === 'card') {
      return this.openCardLoadingDialog(loadingDialogData);
    }
    return this.openBasicLoadingDialog(loadingDialogData);
  }

  private openBasicLoadingDialog(loadingDialogData: LoadingDialogData) {
    return this.matDialog.open(LoadingDialogComponent, {
      width: 'auto',
      autoFocus: false,
      disableClose: true,
      data: loadingDialogData,
      panelClass: 'basic-loading-dialog'
    });
  }

  private openCardLoadingDialog(loadingDialogData: LoadingDialogData) {
    return this.matDialog.open(LoadingDialogComponent, {
      minWidth: '300px',
      autoFocus: false,
      disableClose: true,
      data: loadingDialogData,
    });
  }
}
