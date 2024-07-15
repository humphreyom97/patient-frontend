import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { PatientAddEditComponent } from '../patient-add-edit/patient-add-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SchemaService } from '../services/schema.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { patientDataTabs } from '../data/patient-schema';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DynamicFormComponent,
    MatRadioModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss',
})
export class PatientDetailsComponent implements OnInit {
  patientId!: any;
  patientData: any;
  schema: any;
  patientForm!: FormGroup;
  formLoaded: boolean = false;
  patientDataTabs = patientDataTabs;
  editMode: boolean = false;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private patientService: PatientService,
    private schemaService: SchemaService,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.paramMap.get('id');
    this.getPatientDetails();
  }

  getPatientDetails() {
    if (this.patientId) {
      this.patientService.getPatientById(this.patientId).subscribe({
        next: (res: any[]) => {
          this.patientData = res;
          this.fetchPatientsSchema();
          console.log('res', res);
        },
        error: (err) => {
          console.error('Error fetching patient details:', err);
        },
      });
    }
  }

  fetchPatientsSchema() {
    this.schemaService.getPatientSchema().subscribe({
      next: (data: any) => {
        console.log('test schema', data);
        this.schema = data;
        this.createPatientsForm();
      },
      error: (err: any) => {
        console.error('Error fetching validation metadata:', err);
      },
    });
  }

  createPatientsForm(): void {
    const formGroupConfig = this.createFormGroupConfig(this.schema);
    // create form structure with no data
    this.patientForm = this.formBuilder.group(formGroupConfig);
    // add data to form structure
    this.populateFormWithData();
  }

  createFormGroupConfig(schemaObj: any): any {
    const formGroupConfig: any = {};

    Object.keys(schemaObj).forEach((key) => {
      const field = schemaObj[key];
      if (field.type === 'Embedded' && field.fields) {
        formGroupConfig[key] = this.formBuilder.group(
          this.createFormGroupConfig(field.fields)
        );
      } else if (field.type === 'Array' && field.fields) {
        formGroupConfig[key] = this.formBuilder.array([]);
      } else {
        formGroupConfig[key] = [
          '',
          field.required ? Validators.required : null,
        ];
      }
    });

    return formGroupConfig;
  }

  populateFormWithData() {
    Object.keys(this.patientData).forEach((key) => {
      console.log('key here', key);
      if (Array.isArray(this.patientData[key])) {
        this.populateFormArrayData(key, this.patientData[key]);
      } else if (
        typeof this.patientData[key] === 'object' &&
        this.patientData[key] !== null &&
        !Array.isArray(this.patientData[key])
      ) {
        this.patientForm.get(key)?.patchValue(this.patientData[key]);
      } else {
        this.patientForm.get(key)?.setValue(this.patientData[key]);
      }
    });
  }

  populateFormArrayData(arrayName: string, arrayData: any[]) {
    const formArray = this.patientForm.get(arrayName) as FormArray;
    formArray.clear();
    arrayData.forEach((item) => {
      formArray.push(this.formBuilder.group(item));
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  cancelEditMode(): void {
    this.editMode = !this.editMode;
    // reset form data to original and remove unsaved changes
    this.populateFormWithData();
  }

  savePatient() {
    this.patientService
      .updatePatient(this.patientData._id, this.patientForm.value)
      .subscribe({
        next: (val: any) => {
          this.toggleEditMode();
          this.getPatientDetails();
          this.snackBar.open('Patient deleted successfully!', 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 300000, // Duration in milliseconds
            panelClass: ['custom-snackbar', 'snackbar-success'], // Optional: Custom CSS class for styling
          });
        },
        error: (err: any) => {
          console.error(err);
          alert('Error while updating the Patient!');
        },
      });
  }

  openAddEditPatientDialog() {
    const dialogRef = this.dialog.open(PatientAddEditComponent, {
      data: this.patientData,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPatientDetails();
        }
      },
    });
  }

  deletePatient() {
    if (true) {
      this.snackBar.open('Patient deleted successfully!', 'Close', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 300000, // Duration in milliseconds
        panelClass: ['custom-snackbar', 'snackbar-success'], // Optional: Custom CSS class for styling
      });
    } else {
      let confirm = window.confirm(
        'Are you sure you want to delete this patient?'
      );
      if (confirm) {
        this.patientService.deletePatient(this.patientId).subscribe({
          next: (res) => {
            alert('Patient deleted!');
            // Navigate back to the /patients route
            this.router.navigate(['/patients']);
            // this.getPatientList();
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    }
  }
}
