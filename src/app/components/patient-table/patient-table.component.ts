import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-patient-table',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    FilterComponent,
  ],
  templateUrl: './patient-table.component.html',
  styleUrl: './patient-table.component.scss',
})
export class PatientTableComponent implements OnInit {
  filterValue: string = '';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private patientService: PatientService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getPatientList();
  }

  getPatientList() {
    this.patientService.getPatientList().subscribe({
      next: (res: any[]) => {
        this.dataSource = new MatTableDataSource(res);
        this.addNestedObjectSort();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = (data, filter: string) => {
          const filterWords = filter.trim().toLowerCase().split(/\s+/);
          const personalInfoStr = this.nestedFilterCheck(
            '',
            data.personalInfo
          ).toLowerCase();
          return filterWords.every((word) => personalInfoStr.includes(word));
        };
        this.applyFilter(this.filterValue);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  nestedFilterCheck(search: string, data: any) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object') {
          search = this.nestedFilterCheck(search, data[key]);
        } else {
          if (key === 'dob') {
            search += this.formatDate(data[key]) + ' ';
          } else {
            search += data[key] + ' ';
          }
        }
      }
    }
    return search.trim();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMMM d, y') || '';
  }

  addNestedObjectSort() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property.includes('.')) {
        const keys = property.split('.');
        return keys.reduce((nestedObject, key) => nestedObject[key], item);
      } else {
        return item[property];
      }
    };
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter() {
    this.dataSource.filter = '';
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
        console.error(err);
      },
    });
  }
}
