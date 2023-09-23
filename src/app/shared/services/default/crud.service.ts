import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CrudService<T> {

  constructor(protected requestApi: HttpClient, @Inject('API_URL') private API_URL: string) { }

  getRecords(params?: HttpParams): Observable<T[]> {
    return this.requestApi.get<T[]>(this.API_URL, {params});
  }

  getRecordsPageable(params?: HttpParams): Observable<T[]> {
    return this.requestApi.get<T[]>(`${this.API_URL}/page`, {params});
  }

  getRecordsOnSearch(params?: HttpParams): Observable<T[]> {
    return this.requestApi.get<T[]>(`${this.API_URL}/search`, {params});
  }

  loadById(id: number, params?: HttpParams): Observable<T> {
    return this.requestApi.get<T>(`${this.API_URL}/${id}`, {params}).pipe(take(1));
  }

  saveRecord(record: any, params?: HttpParams): Observable<void> {
    if (record.id) {
      return this.updateRecord(record, params);
    } else {
      return this.addRecord(record, params);
    }
  }

  removeRecord(id: number, params?: HttpParams): Observable<void> {
    return this.requestApi.delete<void>(`${this.API_URL}/${id}`, {params}).pipe(take(1))
  }

  private addRecord(record: any, params?: HttpParams): Observable<void> {
    return this.requestApi.post<void>(this.API_URL, record, {params}).pipe(take(1));
  }

  private updateRecord(record: any, params?: HttpParams): Observable<void> {
    return this.requestApi.put<void>(`${this.API_URL}/${record.id}`, record, {params}).pipe(take(1));
  }
}
