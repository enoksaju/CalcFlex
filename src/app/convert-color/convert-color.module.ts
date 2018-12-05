import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConvertColorPage } from './convert-color.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LabsettingsComponent } from './settings/labsettings.component';
import { RgbsettingsComponent } from './settings/rgbsettings.component';
import { CmyksettingsComponent } from './settings/cmyksettings.component';
import { CmysettingsComponent } from './settings/cmysettings.component';
import { LchsettingsComponent } from './settings/lchsettings.component';
import { HexsettingsComponent } from './settings/hexsettings.component';
import { IonicStorageModule } from '@ionic/storage';

const routes: Routes = [
  {
    path: '',
    component: ConvertColorPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, FlexLayoutModule, IonicModule, IonicStorageModule.forRoot(), RouterModule.forChild(routes)],
  declarations: [ConvertColorPage, RgbsettingsComponent, LabsettingsComponent, CmysettingsComponent, CmyksettingsComponent, LchsettingsComponent, HexsettingsComponent],
})
export class ConvertColorPageModule {}
