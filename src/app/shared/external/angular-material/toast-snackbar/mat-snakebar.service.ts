import {Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class MatSnakebarService {
  private panelClass: string[] = ['toast-success'];
  private action = 'Fechar';
  private durationInSeconds = 3000;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private snakeBar: MatSnackBar) {
  }

  success(message: string, action?: string, duration?: number, horizontalPosition?: string, verticalPosition?: string) {
    this.panelClass = ['success'];
    this.configureSnakeBar(action, duration, horizontalPosition, verticalPosition);
    this.openSnackBar(message);
  }

  error(message: string, action?: string, duration?: number, horizontalPosition?: string, verticalPosition?: string) {
    this.panelClass = ['error'];
    this.configureSnakeBar(action, duration, horizontalPosition, verticalPosition);
    this.openSnackBar(message);
  }

  warning(message: string, action?: string, duration?: number, horizontalPosition?: string, verticalPosition?: string) {
    this.panelClass = ['warning'];
    this.configureSnakeBar(action, duration, horizontalPosition, verticalPosition);
    this.openSnackBar(message);
  }

  configureSnakeBar(action?: string, duration?: number, horizontalPosition?: string, verticalPosition?: string) {
    this.action = action ? action : this.action;
    this.durationInSeconds = duration ? duration : this.durationInSeconds;
    this.horizontalPosition = horizontalPosition ? horizontalPosition as MatSnackBarHorizontalPosition : this.horizontalPosition;
    this.verticalPosition = verticalPosition ? verticalPosition as MatSnackBarVerticalPosition : this.verticalPosition;
  }

  openSnackBar(message: string) {
    this.snakeBar.open(message, this.action, {
      duration: this.durationInSeconds,
      panelClass: this.panelClass,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
