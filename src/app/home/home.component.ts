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
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

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
    HeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  // table column keys
  displayedColumns: string[] = [
    'personalInfo.firstName',
    'personalInfo.lastName',
    'personalInfo.gender',
    'personalInfo.dob',
    'personalInfo.contactInfo.address',
    'personalInfo.contactInfo.phone',
    'action',
  ];

  dataSource = new MatTableDataSource<any>([]);
  public columnNames: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.getPatientList();
  }

  openAddEditPatientDialog() {
    const dialogRef = this.dialog.open(PatientAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          // refresh list to show updates
          this.getPatientList();
        }
      },
    });
  }

  getPatientList() {
    this.patientService.getPatientList().subscribe({
      next: (res: any[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.addNestedObjectSort();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addNestedObjectSort() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) {
        // Split the property path into individual keys
        const keys = property.split('.');
        // Reduce the keys array to navigate through the nested object
        return keys.reduce((nestedObject, key) => nestedObject[key], item);
      } else {
        // Directly access the property if it's not nested
        return item[property];
      }
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetPatientsData() {
    this.patientService.resetPatientsData().subscribe({
      next: () => {
        this.getPatientList();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
