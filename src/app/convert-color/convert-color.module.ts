import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConvertColorPage } from './convert-color.page';
import { RgbsettingsComponent } from './rgbsettings/rgbsettings.component';
import { FlexLayoutModule } from '@angular/flex-layout';

const routes: Routes = [
  {
    path: '',
    component: ConvertColorPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, FlexLayoutModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [ConvertColorPage, RgbsettingsComponent],
})
export class ConvertColorPageModule {}
