import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SenderComponent} from './sender.component'
import {UtilModule} from '../util/util.module';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
 
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    MatSnackBarModule,
    RouterModule,
    UtilModule
  ],
  declarations: [SenderComponent],
  exports: [SenderComponent]
})
export class SenderModule {
}
