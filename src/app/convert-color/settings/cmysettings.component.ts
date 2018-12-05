import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-cmysettings',
  template: `
    <ion-item>
      <ion-range [(ngModel)]="converters.cmy.C" color="cyan" min="0" max="1" step="0.01" (ionChange)="change()"> </ion-range>
      <div slot="end" style="width: 40px; margin: 0px;" (click)="converters.cmy.C = 1">{{ (converters.cmy.C ? converters.cmy.C : 0) | percent: '1.0-0' }}</div>
    </ion-item>
    <ion-item>
      <ion-range [(ngModel)]="converters.cmy.M" color="magent" min="0" max="1" step="0.01" (ionChange)="change()"> </ion-range>
      <div slot="end" style="width: 40px; margin: 0px;" (click)="converters.cmy.M = 1">{{ (converters.cmy.M ? converters.cmy.M : 0) | percent: '1.0-0' }}</div>
    </ion-item>
    <ion-item>
      <ion-range [(ngModel)]="converters.cmy.Y" color="yellow" min="0" max="1" step="0.01" (ionChange)="change()"> </ion-range>
      <div slot="end" style="width: 40px; margin: 0px;" (click)="converters.cmy.Y = 1">{{ (converters.cmy.Y ? converters.cmy.Y : 0) | percent: '1.0-0' }}</div>
    </ion-item>
  `,
  styles: [''],
})
export class CmysettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  change() {
    this.colorChange.emit(this.converters.cmy);
  }
  constructor() {}

  ngOnInit() {}
}
