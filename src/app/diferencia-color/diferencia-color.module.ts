import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IonicModule } from '@ionic/angular';

import { DiferenciaColorPage } from './diferencia-color.page';

import { SettingsColorsModule } from '../settings-colors/settings-colors.module';
const routes: Routes = [
  {
    path: '',
    component: DiferenciaColorPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, FlexLayoutModule, IonicModule, RouterModule.forChild(routes), SettingsColorsModule],
  declarations: [DiferenciaColorPage],
})
export class DiferenciaColorPageModule {}
