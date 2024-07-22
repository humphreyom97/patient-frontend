import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SchemaService } from '../../services/schema.service';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { patientDataTabs } from '../../data/patient-schema';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { PatientDeleteComponent } from '../patient-delete/patient-delete.component';
import { PatientDetailsToolbarComponent } from '../patient-details-toolbar/patient-details-toolbar.component';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    ReactiveFormsModule,
    DynamicFormComponent,
    PersonalInfoComponent,
    PatientDetailsToolbarComponent,
  ],
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
  @ViewChild('content') content!: ElementRef<HTMLFormElement>;

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
          this.getPatientsSchema();
        },
        error: (err) => {
          console.error('Error getting patient details:', err);
        },
      });
    }
  }

  getPatientsSchema() {
    this.schemaService.getPatientSchema().subscribe({
      next: (data: any) => {
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
    this.toggleEditMode();
    // create form from scratch to cancel unsaved changes
    this.createPatientsForm();
  }

  savePatient() {
    this.patientService
      .updatePatient(this.patientData._id, this.patientForm.value)
      .subscribe({
        next: () => {
          this.toggleEditMode();
          this.getPatientDetails();
          this.snackBar.open('Patient updated successfully!', 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 5000,
            panelClass: ['custom-snackbar', 'snackbar-success'],
          });
        },
        error: (err: any) => {
          console.error(err);
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
          duration: 5000,
          panelClass: ['custom-snackbar', 'snackbar-success'],
        });
        // Navigate back to the /patients route
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onToolbarHeightChange(height: number): void {
    if (this.content) {
      this.content.nativeElement.style.marginTop = `${height + 24}px`;
    }
  }
}
