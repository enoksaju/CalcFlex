import { Input, Output, OnInit, EventEmitter, Component } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-rgbsettings',
  template: `
      <ion-item>
        <ion-range [(ngModel)]="converters.rgb.R" color="red" min="0" max="255" step="1" (ionChange)="change()"> </ion-range>
        <div slot="end" style="width: 30px; margin: 0px;" (click)="converters.rgb.R = 118">{{ (converters.rgb.R ? converters.rgb.R : 0) | number: '1.0-0' }}</div>
      </ion-item>
      <ion-item>
        <ion-range [(ngModel)]="converters.rgb.G" color="green" min="0" max="255" step="1" (ionChange)="change()"> </ion-range>
        <div slot="end" style="width: 30px; margin: 0px;" (click)="converters.rgb.G = 118">{{ (converters.rgb.G ? converters.rgb.G : 0) | number: '1.0-0' }}</div>
      </ion-item>
      <ion-item>
        <ion-range [(ngModel)]="converters.rgb.B" color="blue" min="0" max="255" step="1" (ionChange)="change()"> </ion-range>
        <div slot="end" style="width: 30px; margin: 0px;" (click)="converters.rgb.B = 118">{{ (converters.rgb.B ? converters.rgb.B : 0) | number: '1.0-0' }}</div>
      </ion-item>
  `,
  styles: [''],
})
export class RgbsettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  change() {
    this.colorChange.emit(this.converters.rgb);
  }
  constructor() {}
  ngOnInit() {}
}
