import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-character-dialog',
  templateUrl: './see-character-dialog.component.html',
  styleUrl: './see-character-dialog.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
})
export class SeeCharacterDialogComponent {
  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SeeCharacterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      image: [{ value: data.image, disabled: true }],
      name: [{ value: data.name, disabled: true }],
      status: [{ value: data.status, disabled: true }],
      species: [{ value: data.species, disabled: true }],
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value);
    }
  }
}
