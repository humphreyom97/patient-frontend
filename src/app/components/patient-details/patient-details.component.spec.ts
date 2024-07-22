import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDetailsComponent } from './patient-details.component';
import { PatientService } from '../../services/patient.service';
import { SchemaService } from '../../services/schema.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { PatientDeleteComponent } from '../patient-delete/patient-delete.component';
import { PatientDetailsToolbarComponent } from '../patient-details-toolbar/patient-details-toolbar.component';
import { of, Subject, throwError } from 'rxjs';

describe('PatientDetailsComponent', () => {
  let component: PatientDetailsComponent;
  let fixture: ComponentFixture<PatientDetailsComponent>;
  let patientServiceSpy: jasmine.SpyObj<PatientService>;
  let schemaServiceSpy: jasmine.SpyObj<SchemaService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PatientDeleteComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let routerSpy: jasmine.SpyObj<Router>;
  let formBuilder: FormBuilder;
  let getPatientDetailsSpy: jasmine.Spy;

  const mockActivatedRoute = {
    snapshot: { paramMap: new Map([['id', '123']]) },
  };

  beforeEach(async () => {
    patientServiceSpy = jasmine.createSpyObj('PatientService', [
      'getPatientById',
      'updatePatient',
      'deletePatient',
    ]);
    schemaServiceSpy = jasmine.createSpyObj('SchemaService', [
      'getPatientSchema',
    ]);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        PatientDetailsComponent,
        PersonalInfoComponent,
        PatientDeleteComponent,
        PatientDetailsToolbarComponent,
      ],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: patientServiceSpy },
        { provide: SchemaService, useValue: schemaServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDetailsComponent);
    component = fixture.componentInstance;
    patientServiceSpy = TestBed.inject(
      PatientService
    ) as jasmine.SpyObj<PatientService>;
    schemaServiceSpy = TestBed.inject(
      SchemaService
    ) as jasmine.SpyObj<SchemaService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    dialogRefSpy = dialogRefSpy as jasmine.SpyObj<
      MatDialogRef<PatientDeleteComponent>
    >;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    formBuilder = TestBed.inject(FormBuilder);
    getPatientDetailsSpy = spyOn(component, 'getPatientDetails');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run getPatientDetails', () => {
    getPatientDetailsSpy.and.callThrough();
    let mockPatientId = '1';
    component.patientId = mockPatientId;
    const mockPatientData = { _id: '123', name: 'John Doe' };
    patientServiceSpy.getPatientById.and.returnValue(of(mockPatientData));
    spyOn(component, 'getPatientsSchema');

    component.getPatientDetails();

    expect(patientServiceSpy.getPatientById).toHaveBeenCalledWith(
      mockPatientId
    );
    expect(component.patientData).toEqual(mockPatientData);
    expect(component.getPatientsSchema).toHaveBeenCalled();
  });

  it('should handle errors when running getPatientDetails', () => {
    getPatientDetailsSpy.and.callThrough();
    component.patientId = '1';
    // Suppress console errors
    const originalConsoleError = console.error;
    const consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});
    patientServiceSpy.getPatientById.and.returnValue(
      throwError(() => new Error('Error fetching patient details'))
    );

    component.getPatientDetails();

    expect(console.error).toHaveBeenCalledWith(
      'Error getting patient details:',
      jasmine.any(Error)
    );
    // Restore original console error
    console.error = originalConsoleError;
  });

  it('should run getPatientsSchema', () => {
    const mockSchema = { name: { type: 'String', required: true } };
    schemaServiceSpy.getPatientSchema.and.returnValue(of(mockSchema));
    spyOn(component, 'createPatientsForm');

    component.getPatientsSchema();

    expect(schemaServiceSpy.getPatientSchema).toHaveBeenCalled();
    expect(component.schema).toEqual(mockSchema);
    expect(component.createPatientsForm).toHaveBeenCalled();
  });

  it('should handle errors when running getPatientsSchema', () => {
    // Suppress console errors
    const originalConsoleError = console.error;
    const consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});
    schemaServiceSpy.getPatientSchema.and.returnValue(
      throwError(() => new Error('Error fetching schema'))
    );

    component.getPatientsSchema();

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching validation metadata:',
      jasmine.any(Error)
    );
    // Restore original console error
    console.error = originalConsoleError;
  });

  it('should run createPatientsForm', () => {
    const mockFormGroupConfig = {
      personalInfo: formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required],
        dob: ['', Validators.required],
        contactInfo: formBuilder.group({
          address: [''],
          phone: [''],
        }),
      }),
    };

    spyOn(component, 'createFormGroupConfig').and.returnValue(
      mockFormGroupConfig
    );
    spyOn(component, 'populateFormWithData');

    component.createPatientsForm();

    expect(component.createFormGroupConfig).toHaveBeenCalledWith(
      component.schema
    );
    expect(component.populateFormWithData).toHaveBeenCalled();
  });

  it('should run createFormGroupConfig', () => {
    const mockSchema = {
      personalInfo: {
        type: 'Embedded',
        fields: {
          firstName: { type: 'String', required: true },
          lastName: { type: 'String', required: true },
          gender: { type: 'String', required: true },
          dob: { type: 'String', required: true },
          contactInfo: {
            type: 'Embedded',
            fields: {
              address: { type: 'String', required: false },
              phone: { type: 'String', required: false },
            },
          },
        },
      },
      medicalHistory: {
        type: 'Array',
        fields: {
          condition: { type: 'String', required: true },
          treatment: { type: 'String', required: false },
        },
      },
    };

    const mockPatientData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        dob: '2000-01-01',
        contactInfo: {
          address: '123 Main St',
          phone: '555-5555',
        },
      },
      medicalHistory: [
        { condition: 'Diabetes', treatment: 'Insulin' },
        { condition: 'Hypertension', treatment: 'Medication' },
      ],
    };
    component.patientData = mockPatientData;

    const formGroupConfig = component.createFormGroupConfig(mockSchema);

    expect(formGroupConfig).toEqual({
      personalInfo: jasmine.any(Object),
      medicalHistory: jasmine.any(Object),
    });
    const personalInfoGroup = formGroupConfig.personalInfo;
    expect(personalInfoGroup.controls.firstName.value).toBe('');
    expect(personalInfoGroup.controls.firstName.validator).toBe(
      Validators.required
    );
    const medicalHistoryArray = formGroupConfig.medicalHistory;
    expect(medicalHistoryArray.controls.length).toBe(2);
    expect(medicalHistoryArray.controls[0].controls.condition.value).toBe('');
    expect(medicalHistoryArray.controls[0].controls.condition.validator).toBe(
      Validators.required
    );
  });

  it('should run populateFormWithData', () => {
    const mockPatientData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        dob: '2000-01-01',
        contactInfo: {
          address: '123 Main St',
          phone: '555-5555',
        },
      },
    };
    component.patientData = mockPatientData;
    component.patientForm = formBuilder.group({
      personalInfo: formBuilder.group({
        firstName: [''],
        lastName: [''],
        gender: [''],
        dob: [''],
        contactInfo: formBuilder.group({
          address: [''],
          phone: [''],
        }),
      }),
    });

    component.populateFormWithData();

    expect(component.patientForm.value).toEqual(mockPatientData);
  });

  it('should run toggleEditMode', () => {
    component.editMode = false;

    component.toggleEditMode();

    expect(component.editMode).toEqual(true);

    component.toggleEditMode();

    expect(component.editMode).toEqual(false);
  });

  it('should run cancelEditMode', () => {
    spyOn(component, 'toggleEditMode');
    spyOn(component, 'createPatientsForm');

    component.cancelEditMode();

    expect(component.toggleEditMode).toHaveBeenCalled();
    expect(component.createPatientsForm).toHaveBeenCalled();
  });

  it('should run savePatient', () => {
    patientServiceSpy.updatePatient.and.returnValue(of({}));
    const mockPatientData = { _id: '1' };
    component.patientData = mockPatientData;
    spyOn(component, 'toggleEditMode');
    spyOn(component, 'createPatientsForm');
    component.patientForm = formBuilder.group({
      personalInfo: formBuilder.group({
        firstName: ['john'],
        lastName: ['doe'],
        gender: [''],
        dob: [''],
        contactInfo: formBuilder.group({
          address: [''],
          phone: [''],
        }),
      }),
    });

    component.savePatient();

    expect(patientServiceSpy.updatePatient).toHaveBeenCalledWith(
      component.patientData._id,
      component.patientForm.value
    );
    expect(component.toggleEditMode).toHaveBeenCalled();
    expect(component.getPatientDetails).toHaveBeenCalled();
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Patient updated successfully!',
      'Close',
      {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: ['custom-snackbar', 'snackbar-success'],
      }
    );
  });

  it('should handle errors when running getPatientsSchema', () => {
    const mockPatientData = { _id: '1' };
    component.patientData = mockPatientData;
    component.patientForm = formBuilder.group({
      personalInfo: formBuilder.group({
        firstName: ['john'],
        lastName: ['doe'],
        gender: [''],
        dob: [''],
        contactInfo: formBuilder.group({
          address: [''],
          phone: [''],
        }),
      }),
    });
    // Suppress console errors
    const originalConsoleError = console.error;
    const consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});
    const errorMessage = 'Error while updating';
    patientServiceSpy.updatePatient.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.savePatient();

    expect(console.error).toHaveBeenCalledWith(new Error(errorMessage));
    // Restore original console error
    console.error = originalConsoleError;
  });

  it('should run openPatientDeleteComponentDialog', () => {
    // Mock the open method to return the mockDialogRef
    dialogSpy.open.and.returnValue(dialogRefSpy);
    // Spy on the deletePatient method
    spyOn(component, 'deletePatient');

    // Mock the deletePatientEvent observable
    const deletePatientEventSubject = new Subject<void>();
    dialogRefSpy.componentInstance = {
      deletePatientEvent: deletePatientEventSubject.asObservable(),
    } as any;

    component.openPatientDeleteComponentDialog();

    expect(dialogSpy.open).toHaveBeenCalledWith(PatientDeleteComponent, {
      data: component.patientData,
      autoFocus: false,
    });

    // Emit the deletePatientEvent
    deletePatientEventSubject.next();

    // Verify that deletePatient was called
    expect(component.deletePatient).toHaveBeenCalled();
  });

  it('should run deletePatient', () => {
    // Spy on deletePatient
    patientServiceSpy.deletePatient.and.returnValue(of(null));

    // Call the deletePatient method
    component.deletePatient();

    // Verify that snackBar.open was called
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Patient deleted successfully!',
      'Close',
      {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: ['custom-snackbar', 'snackbar-success'],
      }
    );

    // Verify that router.navigate was called with the correct route
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/patients']);
  });

  it('should handle errors when running deletePatient', () => {
    const errorResponse = new Error('Deletion failed');
    patientServiceSpy.deletePatient.and.returnValue(
      throwError(() => errorResponse)
    );
    // Suppress console errors
    const originalConsoleError = console.error;
    const consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});

    component.deletePatient();

    expect(consoleErrorSpy).toHaveBeenCalledWith(errorResponse);
    // Restore original console error
    console.error = originalConsoleError;
  });
});
