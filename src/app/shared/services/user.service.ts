import { Injectable } from '@angular/core';
import {CrudService} from "./default/crud.service";
import {User} from "../interface/user";
import {HttpClient} from "@angular/common/http";
import {API_USER} from "../constants/api";
import {Skill} from "../interface/skill";

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User> {

  constructor(private httpClient: HttpClient) {
    super(httpClient, API_USER)
  }

  getUserRecords() {
    return this.httpClient.get<User>(`${API_USER}/owner`);
  }

  getSkillRecords() {
    return this.httpClient.get<Skill[]>(`${API_USER}/owner/skill`);
  }

  saveSkillRecord(form: any) {
    if (form.id) return this.httpClient.put(`${API_USER}/owner/skill/${form.id}`, form);
    return this.httpClient.post(`${API_USER}/owner/skill`, form);
  }
}
