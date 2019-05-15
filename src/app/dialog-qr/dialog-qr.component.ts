import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-qr',
  templateUrl: './dialog-qr.component.html',
  styleUrls: ['./dialog-qr.component.css']
})
export class DialogQrComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<DialogQrComponent>) { }
  elementType : 'url' | 'canvas' | 'img' = 'url';
  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
