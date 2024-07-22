import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientAddEditComponent } from './patient-add-edit.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { PatientService } from '../../services/patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';

describe('PatientAddEditComponent', () => {
  let component: PatientAddEditComponent;
  let fixture: ComponentFixture<PatientAddEditComponent>;
  let patientServiceSpy: jasmine.SpyObj<PatientService>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PatientAddEditComponent>>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let setupPatientFormSpy: jasmine.Spy;

  beforeEach(async () => {
    patientServiceSpy = jasmine.createSpyObj('PatientService', [
      'addPatient',
      'updatePatient',
    ]);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        PatientAddEditComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatRadioModule,
        MatDialogModule,
        BrowserDynamicTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: patientServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PatientAddEditComponent);
    component = fixture.componentInstance;
    setupPatientFormSpy = spyOn(component, 'setupPatientForm');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.setupPatientForm).toHaveBeenCalled();
  });

  it('should run setupPatientFormn when adding a patient', () => {
    setupPatientFormSpy.and.callThrough();

    component.setupPatientForm();

    const personalInfo = component.patientForm.get('personalInfo');
    const contactInfo = personalInfo?.get('contactInfo');

    expect(personalInfo?.get('firstName')?.value).toBe('');
    expect(
      personalInfo?.get('firstName')?.hasValidator(Validators.required)
    ).toBeTrue();

    expect(personalInfo?.get('lastName')?.value).toBe('');
    expect(
      personalInfo?.get('lastName')?.hasValidator(Validators.required)
    ).toBeTrue();

    expect(personalInfo?.get('gender')?.value).toBe('male');
    expect(
      personalInfo?.get('gender')?.hasValidator(Validators.required)
    ).toBeTrue();

    expect(personalInfo?.get('dob')?.value).toBe('');
    expect(
      personalInfo?.get('dob')?.hasValidator(Validators.required)
    ).toBeTrue();

    expect(contactInfo?.get('address')?.value).toBe('');
    expect(contactInfo?.get('phone')?.value).toBe('');
  });

  it('should run setupPatientFormn when updating a patient', () => {
    setupPatientFormSpy.and.callThrough();
    const mockData = {
      personalInfo: {
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'female',
        dob: '1990-01-01',
        contactInfo: {
          address: '123 Main St',
          phone: '555-5555',
        },
      },
    };
    component.data = mockData;

    component.setupPatientForm();

    const personalInfo = component.patientForm.get('personalInfo');
    const contactInfo = personalInfo?.get('contactInfo');

    expect(personalInfo?.get('firstName')?.value).toBe('Jane');
    expect(personalInfo?.get('lastName')?.value).toBe('Doe');
    expect(personalInfo?.get('gender')?.value).toBe('female');
    expect(personalInfo?.get('dob')?.value).toBe('1990-01-01');

    expect(contactInfo?.get('address')?.value).toBe('123 Main St');
    expect(contactInfo?.get('phone')?.value).toBe('555-5555');
  });

  it('should run onSubmit when updating a patient', () => {
    const mockUpdatedData = {
      personalInfo: {
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'female',
        dob: '1990-01-01',
        contactInfo: {
          address: '123 Main St',
          phone: '555-5555',
        },
      },
    };
    component.data = mockUpdatedData;
    setupPatientFormSpy.and.callThrough();
    component.setupPatientForm();
    patientServiceSpy.updatePatient.and.returnValue(of(null));

    component.onSubmit();

    expect(patientServiceSpy.updatePatient).toHaveBeenCalledWith(
      component.data._id,
      component.patientForm.value
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Patient Updated successfully!',
      'Close',
      {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: ['custom-snackbar', 'snackbar-success'],
      }
    );
  });

  it('should handle errors when running onSubmit when updating a patient', () => {
    const mockUpdatedData = {
      personalInfo: {
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'female',
        dob: '1990-01-01',
        contactInfo: {
          address: '123 Main St',
          phone: '555-5555',
        },
      },
    };
    component.data = mockUpdatedData;
    setupPatientFormSpy.and.callThrough();
    component.setupPatientForm();
    // Suppress console errors
    const originalConsoleError = console.error;
    spyOn(console, 'error').and.callFake(() => {});
    patientServiceSpy.updatePatient.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.onSubmit();

    expect(patientServiceSpy.updatePatient).toHaveBeenCalledWith(
      component.data._id,
      component.patientForm.value
    );
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
    // Restore original console error
    console.error = originalConsoleError;
  });

  it('should run onSubmit when adding a patient', () => {
    const mockFormData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Smith',
        gender: 'male',
        dob: '1985-05-15',
        contactInfo: {
          address: '456 Elm St',
          phone: '555-1234',
        },
      },
    };
    component.data = null;
    setupPatientFormSpy.and.callThrough();
    component.setupPatientForm();
    component.patientForm.patchValue(mockFormData);
    patientServiceSpy.addPatient.and.returnValue(of(null));

    component.onSubmit();

    expect(patientServiceSpy.addPatient).toHaveBeenCalledWith(
      component.patientForm.value
    );
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Patient Added successfully!',
      'Close',
      {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 5000,
        panelClass: ['custom-snackbar', 'snackbar-success'],
      }
    );
  });

  it('should handle errors when running onSubmit when adding a patient', () => {
    const mockFormData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Smith',
        gender: 'male',
        dob: '1985-05-15',
        contactInfo: {
          address: '456 Elm St',
          phone: '555-1234',
        },
      },
    };
    component.data = null;
    setupPatientFormSpy.and.callThrough();
    component.setupPatientForm();
    component.patientForm.patchValue(mockFormData);
    // Suppress console errors
    const originalConsoleError = console.error;
    spyOn(console, 'error').and.callFake(() => {});
    patientServiceSpy.addPatient.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.onSubmit();

    expect(patientServiceSpy.addPatient).toHaveBeenCalledWith(
      component.patientForm.value
    );
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
    // Restore original console error
    console.error = originalConsoleError;
  });
});
