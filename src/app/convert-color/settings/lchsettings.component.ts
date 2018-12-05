import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-lchsettings',
  template: `
    <ion-item>
      <div slot="start" style="width: 15px; margin: 0px;">L</div>
      <ion-range [(ngModel)]="converters.lch.L" color="dark" min="0" max="100" step="1" (ionChange)="change()">
        <ion-icon size="small" style="margin-right:8px; " slot="start" name="sunny"></ion-icon>
        <ion-icon slot="end" style="margin-left:8px; " name="sunny"></ion-icon>
      </ion-range>
      <div slot="end" style="width: 30px; margin: 0px;" (click)="converters.lch.L = 0">{{ (converters.lch.L ? converters.lch.L : 0) | number: '1.0-0' }}</div>
    </ion-item>
    <ion-item>
      <div slot="start" style="width: 15px; margin: 0px;">C</div>
      <ion-range [(ngModel)]="converters.lch.C" color="dark" min="0" max="100" step="1" (ionChange)="change()">
        <ion-icon size="small" style="margin-right:8px; " slot="start" name="color-palette"></ion-icon>
        <ion-icon slot="end" style="margin-left:8px; " name="color-palette"></ion-icon>
      </ion-range>
      <div slot="end" style="width: 30px; margin: 0px;" (click)="converters.lch.C = 0">{{ (converters.lch.C ? converters.lch.C : 0) | number: '1.0-0' }}</div>
    </ion-item>
    <ion-item>
      <div slot="start" style="width: 15px; margin: 0px;">H</div>
      <ion-range [(ngModel)]="converters.lch.H" color="dark" min="0" max="360" step="1" (ionChange)="change()">
        <ion-icon size="small" style="margin-right:8px; " slot="start" name="refresh"></ion-icon>
        <ion-icon slot="end" style="margin-left:8px; " name="refresh"></ion-icon>
      </ion-range>
      <div slot="end" style="width: 30px; margin: 0px;" (click)="converters.lch.H = 0">{{ (converters.lch.H ? converters.lch.H : 0) | number: '1.0-0' }}</div>
    </ion-item>
  `,
  styles: [''],
})
export class LchsettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  change() {
    this.colorChange.emit(this.converters.lch);
  }
  constructor() {}

  ngOnInit() {}
}
