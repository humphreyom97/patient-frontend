import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PatientAddEditComponent } from '../patient-add-edit/patient-add-edit.component';
import { MatTableModule } from '@angular/material/table';
import { PatientService } from '../services/patient.service';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'gender',
    'dob',
    'address',
    'phone',
    'action',
  ];

  dataSource = new MatTableDataSource<any>([]);
  public columnNames: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // dependency injection
  constructor(
    private dialog: MatDialog,
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPatientList();
  }

  openAddEditPatientDialog() {
    const dialogRef = this.dialog.open(PatientAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPatientList();
        }
      },
    });
  }

  getPatientList() {
    this.patientService.getPatientList().subscribe({
      next: (res: any[]) => {
        const transformedData = res.map((patient) => ({
          firstName: patient.personalInfo.firstName,
          lastName: patient.personalInfo.lastName,
          dob: patient.personalInfo.dob,
          gender: patient.personalInfo.gender,
          Address: patient.personalInfo.contactInfo.address,
          Phone: patient.personalInfo.contactInfo.phone,
        }));
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log('res', res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  viewPatientDetails(patientId: string) {
    // Assuming you have a route defined for patient details with a parameter (patientId)
    this.router.navigate(['/patient/details', patientId]);
  }

  openEditForm(data: any) {
    const dialogRef = this.dialog.open(PatientAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getPatientList();
        }
      },
    });
  }
}
