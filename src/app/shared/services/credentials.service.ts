import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_CREDENTIALS} from "../constants/api";
import {AwsConfiguration} from "../interface/aws-configuration";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(private httpClient: HttpClient) { }

  getAwsCredentials() {
    return this.httpClient.get<AwsConfiguration>(`${API_CREDENTIALS}/aws`);
  }
}
