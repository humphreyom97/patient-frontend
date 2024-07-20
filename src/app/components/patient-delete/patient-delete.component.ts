import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-patient-delete',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './patient-delete.component.html',
  styleUrl: './patient-delete.component.scss',
})
export class PatientDeleteComponent {
  @Output() deletePatientEvent: EventEmitter<any> = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<PatientDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmDelete(): void {
    this.deletePatientEvent.emit();
    this.dialogRef.close(true);
  }
}
