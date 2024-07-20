import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { PatientTableComponent } from '../patient-table/patient-table.component';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { PatientAddEditComponent } from '../patient-add-edit/patient-add-edit.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dialog: MatDialog;
  let patientTable: PatientTableComponent;
  let dialogRefSpy: jasmine.SpyObj<any>;

  beforeEach(async () => {
    // Create a spy object for the dialog reference
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatButtonModule,
        HeaderComponent,
        PatientTableComponent,
        HomeComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jasmine
              .createSpy('open')
              .and.returnValue({ afterClosed: () => of(true) }),
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    patientTable = fixture.debugElement.query(
      By.directive(PatientTableComponent)
    )?.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the add/edit patient dialog and refresh list on close', () => {
    // Create a subject to simulate the observable returned by afterClosed
    const afterClosedSubject = new Subject<any>();
    dialogRefSpy.afterClosed.and.returnValue(afterClosedSubject.asObservable());
    spyOn(patientTable, 'getPatientList').and.stub();

    component.openAddEditPatientDialog();
    // Simulate closing the dialog and emitting a value
    afterClosedSubject.next(true);
    afterClosedSubject.complete();

    expect(dialog.open).toHaveBeenCalledWith(PatientAddEditComponent);
    expect(patientTable.getPatientList).toHaveBeenCalled();
  });

  it('should run resetPatientsData', () => {
    spyOn(component.patientTable, 'resetPatientsData').and.stub();

    component.resetPatientsData();

    expect(component.patientTable.resetPatientsData).toHaveBeenCalled();
  });
});
