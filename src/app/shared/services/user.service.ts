import { Injectable } from '@angular/core';
import {CrudService} from "./default/crud.service";
import {User} from "../interface/user";
import {HttpClient} from "@angular/common/http";
import {API_USER} from "../constants/api";
import {Skill} from "../interface/skill";
import {Project} from "../interface/project";
import {Bio} from "../interface/bio";

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

  getProjectStatus() {
    return this.httpClient.get<string[]>(`${API_USER}/owner/project/status`);
  }

  getProjectRecords() {
    return this.httpClient.get<Project[]>(`${API_USER}/owner/project`);
  }

  getProjectRecord(id: number) {
    return this.httpClient.get<Project>(`${API_USER}/owner/project/${id}`);
  }

  getBioRecord() {
    return this.httpClient.get<Bio>(`${API_USER}/owner/bio`);
  }

  saveSkillRecord(form: any) {
    if (form.id) return this.httpClient.put(`${API_USER}/owner/skill/${form.id}`, form);
    return this.httpClient.post(`${API_USER}/owner/skill`, form);
  }

  saveProjectRecord(form: any) {
    if (form.id) return this.httpClient.put(`${API_USER}/owner/project/${form.id}`, form);
    return this.httpClient.post(`${API_USER}/owner/project`, form);
  }

  saveBioRecord(bio: Bio) {
    if (bio?.id) return this.httpClient.put(`${API_USER}/owner/bio/${bio.id}`, bio);
    return this.httpClient.post(`${API_USER}/owner/bio`, bio);
  }

  deleteSkillRecord(id: number) {
    return this.httpClient.delete(`${API_USER}/owner/skill/${id}`);
  }

  deleteProjectRecord(id: number) {
    return this.httpClient.delete(`${API_USER}/owner/project/${id}`);
  }
}
