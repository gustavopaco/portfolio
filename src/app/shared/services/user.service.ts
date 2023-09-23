import { Injectable } from '@angular/core';
import {CrudService} from "./default/crud.service";
import {User} from "../interface/user";
import {HttpClient} from "@angular/common/http";
import {API_USER} from "../constants/api";

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User> {

  constructor(private httpClient: HttpClient) {
    super(httpClient, API_USER)
  }

  getUserRecords() {
    return this.httpClient.get<User>(`${API_USER}/owner`)
  }
}
