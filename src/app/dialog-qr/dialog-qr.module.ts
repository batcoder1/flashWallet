import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { DialogQrComponent } from './dialog-qr.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DialogQrComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    NgxQRCodeModule
  ],
  entryComponents:[
    DialogQrComponent
  ],
  exports:[
    DialogQrComponent
  ]
})
export class DialogQrModule { }
