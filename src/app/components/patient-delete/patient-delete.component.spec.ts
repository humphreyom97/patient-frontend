import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDeleteComponent } from './patient-delete.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('PatientDeleteComponent', () => {
  let component: PatientDeleteComponent;
  let fixture: ComponentFixture<PatientDeleteComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<PatientDeleteComponent>>;
  const dialogData = { patientId: '123' };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatDialogModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run confirmDelete', () => {
    spyOn(component.deletePatientEvent, 'emit');

    component.confirmDelete();

    expect(component.deletePatientEvent.emit).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });
});
