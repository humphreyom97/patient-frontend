import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { patientDataTranslation, getDisplayName } from '../data/patient-schema';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  @Input() parentForm!: any; // The parent FormGroup or FormArray
  @Input() schema!: any; // The data schema for the forms
  @Input() schemaKey!: string; // The data schema key
  @Input() editMode!: boolean; // The data schema key

  patientDataTranslation = patientDataTranslation;

  constructor(private formBuilder: FormBuilder) {}

  isFormGroup(control: any): control is FormGroup {
    return control instanceof FormGroup;
  }

  isFormControl(control: any): control is FormControl {
    return control instanceof FormControl;
  }

  isFormArray(control: any): control is FormArray {
    return control instanceof FormArray;
  }

  getFormGroupControls(control: AbstractControl): any[] {
    if (this.isFormGroup(control)) {
      return Object.keys(control.controls);
    }
    return [];
  }

  getFormArrayControls(control: AbstractControl): AbstractControl[] {
    if (this.isFormArray(control)) {
      return control.controls;
    }
    return [];
  }

  getFormControl(field: string, formGroup: any): FormControl {
    const formControl = formGroup.get(field);
    return formControl;
  }

  getFormControlControls(field: string): any {
    const formControl = this.parentForm.get(field);
    return formControl.controls;
  }

  addFormGroup(formArrayName: any) {
    const newGroup = this.createFormGroupFromSchema(
      this.schema[formArrayName].fields
    );
    this.parentForm.push(newGroup);
  }

  createFormGroupFromSchema(schema: any): any {
    const group = this.formBuilder.group({});
    for (const field in schema) {
      if (schema.hasOwnProperty(field)) {
        group.addControl(
          field,
          this.formBuilder.control(
            '',
            schema[field].required ? Validators.required : null
          )
        );
      }
    }
    return group;
  }

  removeFormGroup(formArray: any, index: number) {
    formArray.removeAt(index);
  }

  getLabel(schemaKey: string): string {
    return getDisplayName(schemaKey);
  }
}
