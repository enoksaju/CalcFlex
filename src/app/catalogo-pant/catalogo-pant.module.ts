import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CatalogoPantPage } from './catalogo-pant.page';
import { FilterPipePantone } from '../filterPantone.pipe';
import { TargetComponent } from './target/target.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogoPantPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CatalogoPantPage, FilterPipePantone, TargetComponent]
})
export class CatalogoPantPageModule {}
