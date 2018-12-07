import { NgModule } from '@angular/core';
import { RgbsettingsComponent } from './settings/rgbsettings.component';
import { LabsettingsComponent } from './settings/labsettings.component';
import { LchsettingsComponent } from './settings/lchsettings.component';
import { HexsettingsComponent } from './settings/hexsettings.component';
import { CmyksettingsComponent } from './settings/cmyksettings.component';
import { CmysettingsComponent } from './settings/cmysettings.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { IonicModule } from '@ionic/angular';
@NgModule({
  imports: [CommonModule, FormsModule, FlexLayoutModule, IonicModule],
  declarations: [RgbsettingsComponent, LabsettingsComponent, LchsettingsComponent, HexsettingsComponent, CmyksettingsComponent, CmysettingsComponent],
  exports: [RgbsettingsComponent, LabsettingsComponent, LchsettingsComponent, HexsettingsComponent, CmyksettingsComponent, CmysettingsComponent],
})
export class SettingsColorsModule {}
