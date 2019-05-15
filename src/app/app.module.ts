import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SenderModule } from './sender/sender.module';
import { SharedModule } from './shared/shared.module';
import { WalletModule } from './wallet/wallet.module';
import { SaleModule } from './sale/sale.module';
import { NoticeModule } from './notice/notice.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { DialogQrModule } from './dialog-qr/dialog-qr.module';
import { DialogModule } from './dialog/dialog.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SenderModule,
    SaleModule,
    WalletModule,
    NoticeModule,
    DialogModule,
    DialogQrModule,
    SharedModule,
    NgxQRCodeModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
