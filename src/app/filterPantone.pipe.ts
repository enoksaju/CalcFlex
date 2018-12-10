import { Pipe, PipeTransform } from '@angular/core';
import { IPantone } from './pantone.service';
@Pipe({
  name: 'filterPantone',
})
export class FilterPipePantone implements PipeTransform {
  transform(items: IPantone[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText);
    });
  }
}
