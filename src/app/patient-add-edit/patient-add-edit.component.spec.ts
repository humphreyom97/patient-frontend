import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAddEditComponent } from './patient-add-edit.component';

describe('PatientAddEditComponent', () => {
  let component: PatientAddEditComponent;
  let fixture: ComponentFixture<PatientAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
