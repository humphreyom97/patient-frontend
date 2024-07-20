import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { SchemaService } from './schema.service';
import { environment } from '../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('SchemaService', () => {
  let service: SchemaService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;
  const patientSchemaUrl = `${apiUrl}/schemas/patients`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SchemaService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SchemaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Ensure that there are no outstanding requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct URL and return data from getPatientSchema', () => {
    const mockResponse = {
      personalInfo: {
        type: 'Embedded',
        fields: {
          firstName: {
            type: 'String',
            required: true,
          },
        },
      },
    };

    service.getPatientSchema().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(patientSchemaUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
