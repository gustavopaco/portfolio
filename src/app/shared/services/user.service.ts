import {Injectable} from '@angular/core';
import {CrudService} from "./default/crud.service";
import {User} from "../interface/user";
import {HttpClient, HttpParams} from "@angular/common/http";
import {API_USER} from "../constants/api";
import {Skill} from "../interface/skill";
import {Project} from "../interface/project";
import {Bio} from "../interface/bio";
import {Course} from "../interface/course";

@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User> {

  constructor(private httpClient: HttpClient) {
    super(httpClient, API_USER)
  }

  getUserDataRecord(params: HttpParams) {
    return this.httpClient.get<User>(`${API_USER}`, {params});
  }

  getUserDataBioSocialRecord(params: HttpParams) {
    return this.httpClient.get<User>(`${API_USER}/bio-social`, {params});
  }

  getSkillRecords(params: HttpParams) {
    return this.httpClient.get<Skill[]>(`${API_USER}/skill`, {params});
  }

  getProjectStatus() {
    return this.httpClient.get<string[]>(`${API_USER}/project/status`);
  }

  getProjectRecords(params: HttpParams) {
    return this.httpClient.get<Project[]>(`${API_USER}/project`, {params});
  }

  getProjectRecord(id: number) {
    return this.httpClient.get<Project>(`${API_USER}/project/${id}`);
  }

  getBioRecord() {
    return this.httpClient.get<Bio>(`${API_USER}/bio`);
  }

  getCourseRecords(params: HttpParams) {
    return this.httpClient.get<Course[]>(`${API_USER}/course`, {params});
  }

  saveSkillRecord(form: any) {
    if (form.id) return this.httpClient.put(`${API_USER}/skill/${form.id}`, form);
    return this.httpClient.post(`${API_USER}/skill`, form);
  }

  saveProjectRecord(form: any) {
    if (form.id) return this.httpClient.put(`${API_USER}/project/${form.id}`, form);
    return this.httpClient.post(`${API_USER}/project`, form);
  }

  saveBioRecord(bio: any) {
    if (bio?.id) return this.httpClient.put(`${API_USER}/bio/${bio.id}`, bio);
    return this.httpClient.post(`${API_USER}/bio`, bio);
  }

  saveSocialRecord(form: any) {
    if (form?.id) return this.httpClient.put(`${API_USER}/social/${form.id}`, form);
    return this.httpClient.post(`${API_USER}/social`, form);
  }

  saveBioSocialRecord(form: any) {
    return this.httpClient.post(`${API_USER}/bio-social`, form);
  }

  saveCoursesRecords(courses: Course[]) {
    return this.httpClient.put(`${API_USER}/course`, courses);
  }

  deleteSkillRecord(id: number) {
    return this.httpClient.delete(`${API_USER}/skill/${id}`);
  }

  deleteProjectRecord(id: number) {
    return this.httpClient.delete(`${API_USER}/owner/project/${id}`);
  }

  deleteCourseRecord(id: number) {
    return this.httpClient.delete(`${API_USER}/course/${id}`);
  }
}
