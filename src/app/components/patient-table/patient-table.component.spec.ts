import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientTableComponent } from './patient-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';
import { of } from 'rxjs';
import { PatientService } from '../../services/patient.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PatientTableComponent', () => {
  let component: PatientTableComponent;
  let fixture: ComponentFixture<PatientTableComponent>;
  let patientService: jasmine.SpyObj<PatientService>;
  let datePipe: DatePipe;
  let getPatientListSpy: jasmine.Spy;

  beforeEach(async () => {
    const patientServiceSpy = jasmine.createSpyObj('PatientService', [
      'getPatientList',
      'resetPatientsData',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        CommonModule,
        RouterModule,
        FilterComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        DatePipe,
        { provide: PatientService, useValue: patientServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientTableComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(
      PatientService
    ) as jasmine.SpyObj<PatientService>;
    datePipe = TestBed.inject(DatePipe);
    getPatientListSpy = spyOn(component, 'getPatientList');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should run getPatientList', () => {
    getPatientListSpy.and.callThrough();
    const mockPatientList = [
      { personalInfo: { firstName: 'John', lastName: 'Doe' } },
    ];
    patientService.getPatientList.and.returnValue(of(mockPatientList));

    component.getPatientList();

    expect(patientService.getPatientList).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockPatientList);
  });

  it('should run nestedFilterCheck', () => {
    spyOn(component, 'formatDate').and.returnValue('January 1, 2000');
    const nestedData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        dob: '2000-01-01',
        contactInfo: {
          address: '123 Main St',
          phone: '555-5555',
        },
      },
    };

    const search = component.nestedFilterCheck('', nestedData);

    const expectedSearch = 'John Doe January 1, 2000 123 Main St 555-5555';
    expect(search).toBe(expectedSearch);
  });

  it('should run applyFilter', () => {
    component.dataSource.paginator = component.paginator;
    spyOn(component.dataSource.paginator!, 'firstPage');

    const filterValue = 'test';
    component.applyFilter(filterValue);

    expect(component.dataSource.filter).toBe(filterValue.trim().toLowerCase());
    expect(component.dataSource.paginator?.firstPage).toHaveBeenCalled();
  });

  it('should run clearFilter', () => {
    component.dataSource.filter = 'test';
    component.dataSource.paginator = component.paginator;
    spyOn(component.dataSource.paginator!, 'firstPage');

    component.clearFilter();

    expect(component.dataSource.filter).toBe('');
    expect(component.dataSource.paginator?.firstPage).toHaveBeenCalled();
  });

  it('should run formatDate', () => {
    spyOn(datePipe, 'transform').and.callThrough();
    const date = '2024-01-01';

    const formattedDate = component.formatDate(date);

    expect(datePipe.transform).toHaveBeenCalledWith(date, 'MMMM d, y');
    expect(formattedDate).toBe('January 1, 2024');
  });

  it('should run addNestedObjectSort', () => {
    component.dataSource = {
      sortingDataAccessor: () => {},
    } as any;

    component.addNestedObjectSort();

    const mockItem: any = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
      },
      contactInfo: {
        phone: '555-5555',
      },
    };

    const nestedAccessor = component.dataSource.sortingDataAccessor;

    // Test with nested property
    expect(nestedAccessor(mockItem, 'personalInfo.firstName')).toBe('John');
    expect(nestedAccessor(mockItem, 'contactInfo.phone')).toBe('555-5555');
    // Test with non-nested property
    expect(nestedAccessor(mockItem, 'personalInfo')).toEqual(
      mockItem.personalInfo
    );
  });

  it('should handle resetPatientsData correctly', () => {
    patientService.resetPatientsData.and.returnValue(of(null));

    component.resetPatientsData();

    expect(patientService.resetPatientsData).toHaveBeenCalled();
    expect(getPatientListSpy).toHaveBeenCalled();
  });
});
