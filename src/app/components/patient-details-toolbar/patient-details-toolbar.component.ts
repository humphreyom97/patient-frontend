import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-patient-details-toolbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './patient-details-toolbar.component.html',
  styleUrl: './patient-details-toolbar.component.scss',
})
export class PatientDetailsToolbarComponent
  implements AfterViewInit, OnDestroy
{
  @Input() editMode: boolean = false;
  @Output() toggleEditMode = new EventEmitter<void>();
  @Output() savePatient = new EventEmitter<void>();
  @Output() cancelEditMode = new EventEmitter<void>();
  @Output() openPatientDeleteDialog = new EventEmitter<void>();
  @ViewChild('toolbarDiv') toolbarDiv!: ElementRef<HTMLDivElement>;
  @Output() heightChange = new EventEmitter<number>();
  resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    if (this.toolbarDiv) {
      this.emitHeight();
      this.setupResizeObserver();
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  emitHeight(): void {
    if (this.toolbarDiv) {
      const height = this.toolbarDiv.nativeElement.offsetHeight;
      this.heightChange.emit(height);
    }
  }

  setupResizeObserver(): void {
    if (this.toolbarDiv) {
      this.resizeObserver = new ResizeObserver(() => this.emitHeight());
      this.resizeObserver.observe(this.toolbarDiv.nativeElement);
    }
  }
}
