import {Injectable, OnDestroy} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class MatSnackbarService implements OnDestroy {
  private panelClass: string[] = ['toast-success'];
  private action = 'Fechar';
  private durationInSeconds = 3000;
  private horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';
  private timeouts: NodeJS.Timeout[] = [];

  constructor(private snakeBar: MatSnackBar) {
  }

  success(message: string, action?: string, duration?: number, horizontalPosition?: string, verticalPosition?: string) {
    const panelClass = ['success'];
    const config = this.configureSnakeBar(panelClass, duration, horizontalPosition, verticalPosition);
    this.openSnackBar(message, config, action);
  }

  error(message: string, action?: string, duration?: number, horizontalPosition?: string, verticalPosition?: string) {
    const panelClass = ['error'];
    const config = this.configureSnakeBar(panelClass, duration, horizontalPosition, verticalPosition);
    this.openSnackBar(message, config, action);
  }

  warning(message: string, action?: string, duration?: number, horizontalPosition?: string, verticalPosition?: string) {
    const panelClass = ['warning'];
    const config = this.configureSnakeBar(panelClass, duration, horizontalPosition, verticalPosition);
    this.openSnackBar(message, config, action);
  }

  configureSnakeBar(panelClass?: string[], duration?: number, horizontalPosition?: string, verticalPosition?: string) {
    return {
      duration: duration ?? this.durationInSeconds,
      panelClass: panelClass ?? this.panelClass,
      horizontalPosition: horizontalPosition as MatSnackBarHorizontalPosition ?? this.horizontalPosition,
      verticalPosition: verticalPosition as MatSnackBarVerticalPosition ?? this.verticalPosition,
    }
  }

  openSnackBar(message: string, config: any, action?: string) {
    const time = setTimeout(() => {
      action = action ?? this.action;
      this.snakeBar.open(message, action, config);
    }, config.duration);
    this.timeouts.push(time);
  }

  ngOnDestroy(): void {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }

}
