import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private httpClient: HttpClient) { }

  uploadFile(formData: FormData, url: string) {
    return this.httpClient.post(url, formData, {reportProgress: true, observe: 'events'});
  }
}
