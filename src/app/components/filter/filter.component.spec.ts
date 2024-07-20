import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterComponent } from './filter.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FilterComponent,
        BrowserAnimationsModule,
        FilterComponent,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.filterValue).toBe('');
  });

  it('should run on filter change', () => {
    spyOn(component.filterChange, 'emit');
    component.filterValue = 'test';

    component.onFilterChange();

    expect(component.filterChange.emit).toHaveBeenCalledWith('test');
  });

  it('should run clear filter', () => {
    spyOn(component.filterChange, 'emit');
    component.filterValue = 'test';

    component.clearFilter();

    expect(component.filterChange.emit).toHaveBeenCalledWith('');
    expect(component.filterValue).toBe('');
  });
});
