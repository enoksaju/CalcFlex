import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { IonicModule } from '@ionic/angular';

import { DiferenciaColorPage } from './diferencia-color.page';

import { LabsettingsComponent } from '../convert-color/settings/labsettings.component';
import { RgbsettingsComponent } from '../convert-color/settings/rgbsettings.component';
import { CmyksettingsComponent } from '../convert-color/settings/cmyksettings.component';
import { CmysettingsComponent } from '../convert-color/settings/cmysettings.component';
import { LchsettingsComponent } from '../convert-color/settings/lchsettings.component';
import { HexsettingsComponent } from '../convert-color/settings/hexsettings.component';

const routes: Routes = [
  {
    path: '',
    component: DiferenciaColorPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, FlexLayoutModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [DiferenciaColorPage, RgbsettingsComponent, LabsettingsComponent, CmysettingsComponent, CmyksettingsComponent, LchsettingsComponent, HexsettingsComponent],
})
export class DiferenciaColorPageModule {}
