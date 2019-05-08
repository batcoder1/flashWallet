import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MatSnackBarModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { UtilModule } from '../util/util.module';
import { SaleComponent } from './sale.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    RouterModule,
    UtilModule
  ],
  declarations: [SaleComponent],
  exports: [SaleComponent]
})
export class SaleModule { }
