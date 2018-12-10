import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PantoneService, IPantone } from '../pantone.service';
import { Subscription } from 'rxjs';
import { InfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-catalogo-pant',
  templateUrl: './catalogo-pant.page.html',
  styleUrls: ['./catalogo-pant.page.scss'],
})
export class CatalogoPantPage implements OnInit, OnDestroy {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  pantoneColors$: Subscription;
  pantoneColors: IPantone[] = [];
  limit = 10;
  searchPantoneText: string = null;
  constructor(private pantoneService: PantoneService) {
    this.pantoneColors$ = this.pantoneService.pantoneColors().subscribe(y => (this.pantoneColors = y));
  }

  ngOnInit() {
    // this.pantoneService.getPantoneColorsPage(this.page, 1).then(g => {
    //   console.log(g);
    //   this.pantoneColors.concat(g);
    // });
  }
  ngOnDestroy(): void {
    this.pantoneColors$.unsubscribe();
  }

  async loadData(event) {
    setTimeout(() => {
      console.log('loading data');
      this.limit += 5;
      event.target.complete();
      console.log('done');
    }, 500);
  }
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}
