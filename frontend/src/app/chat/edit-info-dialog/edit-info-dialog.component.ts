import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface EditInfoDialogData {
  currentName: string;
}

@Component({
  selector: 'app-edit-info-dialog',
  templateUrl: './edit-info-dialog.component.html',
  styleUrls: ['./edit-info-dialog.component.scss'],
  standalone: true,
  imports: [FormsModule, MatInputModule, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions]
})
export class EditInfoDialogComponent {
  newName: string = '';

  constructor(
    public dialogRef: MatDialogRef<EditInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditInfoDialogData
  ) {
    this.newName = data.currentName;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.newName.trim()) {
      this.dialogRef.close(this.newName.trim());
    }
  }
}
