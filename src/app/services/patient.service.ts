import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:3000/patients';

  constructor(private httpClient: HttpClient) {}

  getPatientList(): Observable<any> {
    return this.httpClient.get(this.apiUrl);
  }

  getPatientById(id: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/${id}`);
  }

  addPatient(data: any): Observable<any> {
    return this.httpClient.post(this.apiUrl, data);
  }

  updatePatient(id: string, data: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/${id}`, data);
  }

  deletePatient(id: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  getPatientSchemaMetadata(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/schema`);
  }
}
