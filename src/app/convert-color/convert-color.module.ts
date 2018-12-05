import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConvertColorPage } from './convert-color.page';
import { RgbsettingsComponent } from './rgbsettings/rgbsettings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LabsettingsComponent } from './labsettings/labsettings.component';
import { CmysettingsComponent } from './cmysettings/cmysettings.component';
import { CmyksettingsComponent } from './cmyksettings/cmyksettings.component';
import { LchsettingsComponent } from './lchsettings/lchsettings.component';
import { XyzsettingsComponent } from './xyzsettings/xyzsettings.component';
import { HexsettingsComponent } from './hexsettings/hexsettings.component';

const routes: Routes = [
  {
    path: '',
    component: ConvertColorPage,
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, FlexLayoutModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [ConvertColorPage, RgbsettingsComponent, LabsettingsComponent, CmysettingsComponent, CmyksettingsComponent, LchsettingsComponent, XyzsettingsComponent, HexsettingsComponent],
})
export class ConvertColorPageModule {}
