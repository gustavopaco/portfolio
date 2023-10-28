import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from "../../shared/services/user.service";
import {ActivatedRoute} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {environment} from "../../../environments/environment";
import {HttpParams} from "@angular/common/http";
import {take} from "rxjs";
import {User} from "../../shared/interface/user";
import {MatSnackbarService} from "../../shared/external/angular-material/toast-snackbar/mat-snackbar.service";
import {ACTION_CLOSE} from "../../shared/constants/constants";
import {HttpValidator} from "../../shared/validator/http-validator";

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  destroyRef = inject(DestroyRef);
  user?: User;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private matSnackBarService: MatSnackbarService) {
  }

  ngOnInit(): void {
    this.getPathParams();
  }

 private getPathParams() {
   this.activatedRoute.params
     .pipe(takeUntilDestroyed(this.destroyRef))
     .subscribe(params => {
       params['nickname'] ? this.loadUserData(params['nickname']) : this.loadUserData(environment.OWNER_NICKNAME);
     })
 }

  private paramsToRequest(nickname: string) {
    return new HttpParams().set('nickname', nickname);
  }

  private loadUserData(nickname: string) {
    this.userService.getUserDataRecord(this.paramsToRequest(nickname))
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          this.matSnackBarService.error(HttpValidator.validateResponseErrorMessage(error), ACTION_CLOSE, 5000);
          // todo: redirect to 404 page
        }
      });
  }

}
