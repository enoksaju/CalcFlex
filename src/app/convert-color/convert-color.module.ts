import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConvertColorPage } from './convert-color.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IonicStorageModule } from '@ionic/storage';
import { SettingsColorsModule } from '../settings-colors/settings-colors.module';

const routes: Routes = [
  {
    path: '',
    component: ConvertColorPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, FlexLayoutModule, IonicModule, IonicStorageModule.forRoot(), RouterModule.forChild(routes), SettingsColorsModule],
  declarations: [ConvertColorPage],
})
export class ConvertColorPageModule {}
