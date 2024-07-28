import { Component, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PatientAddEditComponent } from '../patient-add-edit/patient-add-edit.component';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { PatientTableComponent } from '../patient-table/patient-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    HeaderComponent,
    PatientTableComponent,
  ],
  providers: [DatePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild(PatientTableComponent) patientTable!: PatientTableComponent;

  constructor(private dialog: MatDialog) {}

  openAddEditPatientDialog() {
    const dialogRef = this.dialog.open(PatientAddEditComponent, {
      minWidth: '400px',
      maxHeight: '100vh',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // refresh list to show updates
          this.patientTable.getPatientList();
        }
      },
    });
  }

  resetPatientsData() {
    if (this.patientTable) {
      this.patientTable.resetPatientsData();
    }
  }
}
