import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_AUTH, API_RESET_PASSWORD, API_RESET_PASSWORD_LINK, API_VALIDATE_TOKEN} from "../../constants/api";
import {Router} from "@angular/router";
import {take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  authenticate(form: any) {
    return this.httpClient.post(API_AUTH, form, {observe: 'response'})
  }

  sendMailToResetPassword(form: any, params: HttpParams) {
    return this.httpClient.post(API_RESET_PASSWORD_LINK, null, {params});
  }

  validateTokenBeforeResetPassword(params: HttpParams) {
    return this.httpClient.post(API_VALIDATE_TOKEN, null, {params}).pipe(take(1))
  }

  resetPassword(form: any) {
    return this.httpClient.post(API_RESET_PASSWORD, form);
  }

  isUserLogged(): boolean {
    return localStorage.getItem("t") != undefined;
  }

  saveToken(token: string): void {
    localStorage.setItem("t", token);
  }

  savePermissions(response: any): void {
    const localStorageMappings: Record<string, string> = {
      jwt: "KEY_JWT",
      authorities: "KEY_AUTHORITY",
      id: "KEY_USER_ID",
      username: "KEY_USERNAME",
      lat: "KEY_USER_LAT",
      long: "KEY_USER_LONG",
      city: "KEY_USER_CITY",
      profilePicture: "KEY_USER_PHOTO",
    };
    for (let key in localStorageMappings) {
      if (response?.hasOwnProperty(key)) {
        const localStorageKey = localStorageMappings[key];
        localStorage.setItem(localStorageKey, response[key]);
      }
    }
  }

  getLat() {
    return localStorage.getItem("lat");
  }

  getLong() {
    return localStorage.getItem("long");
  }

  getCity() {
    return localStorage.getItem("city");
  }

  saveCartQuantity(itens: number) {
    localStorage.setItem("KEY_CART_QUANTITY", String(itens));
  }

  getCartQuantity() {
    const quantity = localStorage.getItem("KEY_CART_QUANTITY");
    if (quantity != undefined) {
      return Number(quantity);
    } else {
      return 0;
    }
  }

  increaseCartQuantity() {
    let quantidade = this.getCartQuantity();
    quantidade++;
    this.saveCartQuantity(quantidade);
  }

  decreaseCartQuantity() {
    let quantity = this.getCartQuantity();
    quantity--;
    this.saveCartQuantity(quantity);
  }

  clearCart() {
    this.saveCartQuantity(0);
  }

  private getPermissions(permission: string): boolean {
    let existRoles = localStorage.getItem("KEY_AUTHORITY") != undefined;
    if (!existRoles) {
      return false;
    }
    //let roles: Role[] = JSON.parse(<string>localStorage.getItem("KEY_AUTHORITY"))
    //return !!roles.find(r => r.authority == permission);
    return true;
  }

  isAdmin(): boolean {
    return this.getPermissions("ROLE_ADMIN");
  }

  isUser(): boolean {
    return this.getPermissions("ROLE_FISICA");
  }

  isCompany(): boolean {
    return this.getPermissions("ROLE_JURIDICA");
  }

  getFullToken(): string {
    return <string>localStorage.getItem("t");
  }

  getUserId(): string {
    return <string>localStorage.getItem("KEY_USER_ID");
  }

  getUserName(): string {
    return <string>localStorage.getItem("KEY_USERNAME");
  }

  getUserPhoto(): string | undefined {
    let item = localStorage.getItem("KEY_USER_PHOTO");
    if (item != undefined) {
      return item;
    }
    return undefined;
  }

  invalidateSession(): void {
    localStorage.clear();
    this.router.navigate(['/auth'])
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/'])
  }

  redirectToLogin() {
    this.router.navigate(['/auth'])
  }

  redirectToHome() {
    this.router.navigate(['/profile'])
  }

  adicionarTempExternalApiRequest() {
    localStorage.setItem("tempExternalApiRequest", "true");
  }

  removerTempExternalApiRequest() {
    localStorage.removeItem("tempExternalApiRequest");
  }

  isTempExternalApiRequest(): boolean {
    return localStorage.getItem("tempExternalApiRequest") != undefined;
  }
}
