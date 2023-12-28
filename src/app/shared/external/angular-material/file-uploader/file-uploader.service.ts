import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpParams, HttpResponse} from "@angular/common/http";
import {filter, map, pipe, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private httpClient: HttpClient) { }

  uploadFile(file: File, url: string, params?: HttpParams) {
    const formData = this.createFormData(file);
    return this.httpClient.post(url, formData, {reportProgress: true, observe: 'events', params: params, responseType: 'text'});
  }

  private createFormData(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  }

  fileUploadInProgress = <T>(callback: (porcentagemAtual: number) => void) => {
    return tap((event: HttpEvent<T>) => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        callback(Math.round((event.loaded * 100) / event.total));
      }
    })
  }

  fileUploadProgressComplete = <T>(callback: (porcentagemAtual: number) => void) => {
    return tap((event: HttpEvent<T>) => {
      if (event.type === HttpEventType.Response) {
        callback(100);
      }
    })
  }

  fileUploadHttEventToUploadResult = <T>() => {
    return pipe(
      filter((event: any) => event.type === HttpEventType.Response),
      map((response: HttpResponse<T>) => response.body)
    )
  }
}
