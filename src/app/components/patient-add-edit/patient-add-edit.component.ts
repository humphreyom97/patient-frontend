import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PatientService } from '../../services/patient.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-patient-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './patient-add-edit.component.html',
  styleUrl: './patient-add-edit.component.scss',
})
export class PatientAddEditComponent implements OnInit {
  patientForm!: FormGroup;

  constructor(
    private patientService: PatientService,
    private dialogRef: MatDialogRef<PatientAddEditComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setupPatientForm();
  }

  setupPatientForm() {
    this.patientForm = this.formBuilder.group({
      personalInfo: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['male', Validators.required],
        dob: ['', Validators.required],
        contactInfo: this.formBuilder.group({
          address: [''],
          phone: [''],
        }),
      }),
    });
    // populate form if updating patient
    if (this.data) {
      this.patientForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.data) {
      this.patientService
        .updatePatient(this.data._id, this.patientForm.value)
        .subscribe({
          next: () => {
            this.dialogRef.close(true);
            this.snackBar.open('Patient Updated successfully!', 'Close', {
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
    } else {
      this.patientService.addPatient(this.patientForm.value).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open('Patient Added successfully!', 'Close', {
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
  }
}
