import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { IonicModule } from '@ionic/angular';

import { AltoRolloPage } from './alto-rollo.page';

const routes: Routes = [
  {
    path: '',
    component: AltoRolloPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AltoRolloPage]
})
export class AltoRolloPageModule {}
