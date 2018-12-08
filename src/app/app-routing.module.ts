import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule',
  },
  { path: 'ml', loadChildren: './metros-lineales/metros-lineales.module#MetrosLinealesPageModule' },
  { path: 'altoRollo', loadChildren: './alto-rollo/alto-rollo.module#AltoRolloPageModule' }, 
  { path: 'convertColor', loadChildren: './convert-color/convert-color.module#ConvertColorPageModule' },
  { path: 'diferenciaColor', loadChildren: './diferencia-color/diferencia-color.module#DiferenciaColorPageModule' },
  { path: 'catalogoPant', loadChildren: './catalogo-pant/catalogo-pant.module#CatalogoPantPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
