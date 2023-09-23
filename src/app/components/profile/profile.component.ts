import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserService} from "../../shared/services/user.service";
import {take} from "rxjs";
import {MatSnakebarService} from "../../shared/external/angular-material/toast-snackbar/mat-snakebar.service";
import {HttpValidator} from "../../shared/validator/http-validator";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private userService: UserService,
              private matSnackBarService: MatSnakebarService) {}

  ngOnInit(): void {
    this.getUserRecords()
  }

  private getUserRecords() {
    this.userService.getUserRecords()
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log(response)},
        error: (error) => this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), 'Failed', 5000)
      })
  }

}
