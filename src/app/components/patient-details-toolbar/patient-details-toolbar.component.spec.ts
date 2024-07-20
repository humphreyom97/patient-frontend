import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientDetailsToolbarComponent } from './patient-details-toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { ElementRef } from '@angular/core';

describe('PatientDetailsToolbarComponent', () => {
  let component: PatientDetailsToolbarComponent;
  let fixture: ComponentFixture<PatientDetailsToolbarComponent>;
  let resizeObserverSpy: jasmine.SpyObj<ResizeObserver>;
  let toolbarDiv: HTMLElement;

  const mockActivatedRoute = {
    data: of({ patientId: '123' }),
  };

  beforeEach(async () => {
    resizeObserverSpy = jasmine.createSpyObj('ResizeObserver', [
      'observe',
      'disconnect',
    ]);
    spyOn(window, 'ResizeObserver').and.returnValue(resizeObserverSpy as any);

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientDetailsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call emitHeight and setupResizeObserver on ngAfterViewInit', () => {
    spyOn(component, 'emitHeight').and.callThrough();
    spyOn(component, 'setupResizeObserver').and.callThrough();

    component.ngAfterViewInit();

    expect(component.emitHeight).toHaveBeenCalled();
    expect(component.setupResizeObserver).toHaveBeenCalled();
  });

  it('should call disconnect on ngOnDestroy', () => {
    component.setupResizeObserver();

    component.ngOnDestroy();

    expect(resizeObserverSpy.disconnect).toHaveBeenCalled();
  });

  it('should emit the height of toolbarDiv', () => {
    const divElement = document.createElement('div');
    divElement.style.height = '100px';
    Object.defineProperty(divElement, 'offsetHeight', { value: 100 });
    component.toolbarDiv = new ElementRef(divElement);

    const heightChangeSpy = spyOn(
      component.heightChange,
      'emit'
    ).and.callThrough();

    component.emitHeight();

    expect(heightChangeSpy).toHaveBeenCalledWith(100);
  });

  it('should set up ResizeObserver and observe toolbarDiv', () => {
    const divElement = document.createElement('div');
    component.toolbarDiv = new ElementRef(divElement);

    component.setupResizeObserver();

    expect(resizeObserverSpy.observe).toHaveBeenCalledWith(divElement);
  });
});
