import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CatalogoPantPage } from './catalogo-pant.page';
import { FilterPipePantone } from '../filterPantone.pipe';

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
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CatalogoPantPage, FilterPipePantone]
})
export class CatalogoPantPageModule {}
