import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CatalogoPantPage } from './catalogo-pant.page';

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
  declarations: [CatalogoPantPage]
})
export class CatalogoPantPageModule {}
