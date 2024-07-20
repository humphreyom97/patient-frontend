import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PatientService } from './patient.service';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('PatientService', () => {
  let service: PatientService;
  let httpMock: HttpTestingController;
  const BASE_URL = `${environment.apiUrl}/patients`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PatientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getPatientList', () => {
    it('should return an Observable<any>', () => {
      const dummyPatients = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' },
      ];

      service.getPatientList().subscribe((patients) => {
        expect(patients.length).toBe(2);
        expect(patients).toEqual(dummyPatients);
      });

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('GET');
      req.flush(dummyPatients);
    });
  });

  describe('#getPatientById', () => {
    it('should return an Observable<any>', () => {
      const dummyPatient = { id: 1, name: 'John Doe' };
      const patientId = '1';

      service.getPatientById(patientId).subscribe((patient) => {
        expect(patient).toEqual(dummyPatient);
      });

      const req = httpMock.expectOne(`${BASE_URL}/${patientId}`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyPatient);
    });

    it('should handle errors', () => {
      const patientId = '1';
      const errorMessage = 'Patient not found';

      service.getPatientById(patientId).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/${patientId}`);
      expect(req.request.method).toBe('GET');
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#addPatient', () => {
    it('should add a patient and return the response', () => {
      const newPatient = { name: 'New Patient' };
      const dummyResponse = { id: 3, ...newPatient };

      service.addPatient(newPatient).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPatient);
      req.flush(dummyResponse);
    });

    it('should handle errors', () => {
      const newPatient = { name: 'New Patient' };
      const errorMessage = 'Error adding patient';

      service.addPatient(newPatient).subscribe({
        next: () => fail('should have failed with a 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPatient);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('#updatePatient', () => {
    it('should update a patient and return the updated patient', () => {
      const patientId = '1';
      const updateData = { name: 'Updated Patient' };
      const dummyResponse = { id: 1, ...updateData };

      service.updatePatient(patientId, updateData).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/${patientId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(dummyResponse);
    });

    it('should handle errors', () => {
      const patientId = '1';
      const updateData = { name: 'Updated Patient' };
      const errorMessage = 'Error updating patient';

      service.updatePatient(patientId, updateData).subscribe({
        next: () => fail('should have failed with a 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/${patientId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('#deletePatient', () => {
    it('should delete a patient and return a success message', () => {
      const patientId = '1';
      const dummyResponse = { message: 'Patient deleted successfully' };

      service.deletePatient(patientId).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/${patientId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(dummyResponse);
    });

    it('should handle errors', () => {
      const patientId = '1';
      const errorMessage = 'Error deleting patient';

      service.deletePatient(patientId).subscribe({
        next: () => fail('should have failed with a 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/${patientId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('#resetPatientsData', () => {
    it('should reset patients data and return a success message', () => {
      const dummyResponse = { message: 'Patients data reset successfully' };

      service.resetPatientsData().subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${BASE_URL}/resetPatients`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(dummyResponse);
    });

    it('should handle errors', () => {
      const errorMessage = 'Error resetting patients data';

      service.resetPatientsData().subscribe({
        next: () => fail('should have failed with a 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/resetPatients`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });
});
