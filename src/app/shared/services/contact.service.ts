import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_CONTACT} from "../constants/api";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient: HttpClient) { }

  sendEmail(form: any) {
    return this.httpClient.post(`${API_CONTACT}`, form);
  }
}
