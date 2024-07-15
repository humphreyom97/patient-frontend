import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private apiUrl = 'http://localhost:3000/schemas';

  constructor(private httpClient: HttpClient) {}

  getPatientSchema(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/patients`);
  }
}
