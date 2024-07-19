import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import {
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
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { PatientDeleteComponent } from '../patient-delete/patient-delete.component';
import { HeaderComponent } from '../header/header.component';

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
    PersonalInfoComponent,
    PatientDeleteComponent,
    HeaderComponent,
    RouterModule,
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
    console.log('testing', this.patientForm);
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
        const formArray: any = this.formBuilder.array([]);
        // for each array item, create a form group with fields
        this.patientData[key].forEach((data: any) => {
          formArray.push(
            this.formBuilder.group(this.createFormGroupConfig(field.fields))
          );
        });

        formGroupConfig[key] = formArray;
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
    this.patientForm.patchValue(this.patientData);
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  cancelEditMode(): void {
    this.editMode = !this.editMode;
    // create form from scratch to cancel unsaved changes
    this.createPatientsForm();
  }

  savePatient() {
    this.patientService
      .updatePatient(this.patientData._id, this.patientForm.value)
      .subscribe({
        next: (val: any) => {
          this.toggleEditMode();
          this.getPatientDetails();
          this.snackBar.open('Patient updated successfully!', 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 300000, // Duration in milliseconds
            panelClass: ['custom-snackbar', 'snackbar-success'],
          });
        },
        error: (err: any) => {
          console.error(err);
          alert('Error while updating the Patient!');
        },
      });
  }

  openPatientDeleteComponentDialog() {
    const dialogRef = this.dialog.open(PatientDeleteComponent, {
      data: this.patientData,
      autoFocus: false,
    });

    dialogRef.componentInstance.deletePatientEvent.subscribe(() => {
      this.deletePatient();
    });
  }

  deletePatient() {
    this.patientService.deletePatient(this.patientId).subscribe({
      next: () => {
        this.snackBar.open('Patient deleted successfully!', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000, // Duration in milliseconds
          panelClass: ['custom-snackbar', 'snackbar-success'],
        });
        // Navigate back to the /patients route
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
