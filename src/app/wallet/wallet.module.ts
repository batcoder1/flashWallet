import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatSnackBarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { WalletComponent } from './wallet.component';

@NgModule({
  
  imports: [
      CommonModule,
      SharedModule,
      MatSnackBarModule,
      RouterModule,
      UtilModule,
     
    ],
    declarations: [WalletComponent],
    exports: [WalletComponent]
})
export class WalletModule { }
