import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicFormComponent } from './dynamic-form.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import * as patientSchema from '../../data/patient-schema';

// mock the getDisplayName function
const mockGetDisplayName = jasmine.createSpy('getDisplayName');

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatDatepickerModule,
        DynamicFormComponent,
      ],
      providers: [
        FormBuilder,
        provideNativeDateAdapter(),
        { provide: 'getDisplayName', useValue: mockGetDisplayName },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run isFormGroup', () => {
    const formGroup = new FormGroup({});
    const formArray = new FormArray([]);

    let formGroupResult = component.isFormGroup(formGroup);

    expect(formGroupResult).toBeTrue();

    let formArrayResult = component.isFormGroup(formArray);

    expect(formArrayResult).toBeFalse();
  });

  it('should run isFormArray', () => {
    const formGroup = new FormGroup({});
    const formArray = new FormArray([]);

    let formArrayResult = component.isFormArray(formArray);

    expect(formArrayResult).toBeTrue();

    let formGroupResult = component.isFormArray(formGroup);

    expect(formGroupResult).toBeFalse();
  });

  it('should run isFormControl', () => {
    const formArray = new FormArray([]);
    const formControl = new FormControl('');

    let formControlResult = component.isFormControl(formControl);

    expect(formControlResult).toBeTrue();

    let formArrayResult = component.isFormControl(formArray);

    expect(formArrayResult).toBeFalse();
  });

  it('should run getFormGroupControls', () => {
    component.parentForm = new FormGroup({
      personalInfo: new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        dob: new FormControl(''),
      }),
    });
    const formGroup = component.parentForm.get('personalInfo') as FormGroup;

    const controls = component.getFormGroupControls(formGroup);

    expect(controls).toEqual(['firstName', 'lastName', 'dob']);
  });

  it('should run getFormArrayControls', () => {
    const formArray = new FormArray([
      new FormControl('Control 1'),
      new FormControl('Control 2'),
      new FormControl('Control 3'),
    ]);

    const result = component.getFormArrayControls(formArray);

    expect(result).toEqual(formArray.controls);
    expect(result.length).toBe(3);
    expect(result[0] instanceof FormControl).toBeTrue();
    expect(result[1] instanceof FormControl).toBeTrue();
    expect(result[2] instanceof FormControl).toBeTrue();
  });

  it('should run getFormControl', () => {
    const formGroup = new FormGroup({
      name: new FormControl('John Doe'),
    });

    const result = component.getFormControl('name', formGroup);

    expect(result).toBeInstanceOf(FormControl);
    expect(result.value).toBe('John Doe');
  });

  it('should run getFormControlControls', () => {
    const nestedFormGroup = new FormGroup({
      address: new FormControl('123 Main St'),
      phone: new FormControl('555-5555'),
    });
    const formGroup = new FormGroup({
      personalInfo: nestedFormGroup,
    });
    component.parentForm = formGroup;

    const result = component.getFormControlControls('personalInfo');

    expect(result).toEqual(nestedFormGroup.controls);
  });

  it('should run addFormGroup', () => {
    component.schema = {
      addressArray: {
        fields: {
          address: { required: true },
          phone: { required: false },
        },
      },
    };
    const initialFormGroup = new FormGroup({
      address: new FormControl('Initial Address'),
      phone: new FormControl('Initial Phone'),
    });
    component.parentForm = new FormArray([initialFormGroup]);
    const newGroup = new FormGroup({
      address: new FormControl('New Address'),
      phone: new FormControl('New Phone'),
    });
    spyOn(component, 'createFormGroupFromSchema').and.returnValue(newGroup);

    component.addFormGroup('addressArray');

    const formArray = component.parentForm as FormArray;
    expect(formArray.length).toBe(2);
    // new group should be at the start
    expect(formArray.at(0)).toBe(newGroup);
    expect(formArray.at(1)).toBe(initialFormGroup);
  });

  it('should run createFormGroupFromSchema', () => {
    const mockSchema = {
      firstName: { required: true },
      lastName: { required: true },
      email: { required: false },
      _id: { required: false },
    };

    const resultGroup = component.createFormGroupFromSchema(mockSchema);

    expect(resultGroup instanceof FormGroup).toBe(true);
    expect(resultGroup.contains('firstName')).toBe(true);
    expect(resultGroup.contains('lastName')).toBe(true);
    expect(resultGroup.contains('email')).toBe(true);
    expect(resultGroup.contains('_id')).toBe(false);
    expect(resultGroup.get('firstName')?.validator).toBeTruthy();
    expect(resultGroup.get('lastName')?.validator).toBeTruthy();
    expect(resultGroup.get('email')?.validator).toBeNull();
  });

  it('should run removeFormGroup', () => {
    const formArray = formBuilder.array([
      formBuilder.group({
        firstName: ['John', Validators.required],
        lastName: ['Doe'],
      }),
      formBuilder.group({
        firstName: ['Jane', Validators.required],
        lastName: ['Smith'],
      }),
    ]);
    component.parentForm = formBuilder.group({
      addressArray: formArray,
    });

    component.removeFormGroup(
      component.parentForm.get('addressArray') as FormArray,
      0
    );

    expect((component.parentForm.get('addressArray') as FormArray).length).toBe(
      1
    );
    const remainingGroup = (
      component.parentForm.get('addressArray') as FormArray
    ).at(0) as FormGroup;
    expect(remainingGroup.get('firstName')?.value).toBe('Jane');
    expect(remainingGroup.get('lastName')?.value).toBe('Smith');
  });

  fit('should run getLabel', () => {
    const mockSchemaKey = 'firstName';
    const mockLabel = 'First Name';
    mockGetDisplayName.and.returnValue(mockLabel);
    // Assign the mocked function to the import
    spyOn(patientSchema, 'getDisplayName').and.callFake(mockGetDisplayName);

    const result = component.getLabel(mockSchemaKey);

    expect(mockGetDisplayName).toHaveBeenCalledWith(mockSchemaKey);
    expect(result).toBe(mockLabel);
  });
});
