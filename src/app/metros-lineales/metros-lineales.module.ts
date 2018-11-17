import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { IonicModule } from '@ionic/angular';

import { MetrosLinealesPage } from './metros-lineales.page';

const routes: Routes = [
  {
    path: '',
    component: MetrosLinealesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MetrosLinealesPage]
})
export class MetrosLinealesPageModule {}
