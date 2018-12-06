import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-labsettings',
  template: `
<ion-item>
  <div slot="start" style="width: 15px; margin: 0px;">L</div>
  <ion-range [(ngModel)]="converters.lab.L" min="0" max="100" step="0.5" (ionChange)="change()">
    <ion-icon size="small" style="margin-right:8px; " slot="start" name="sunny"></ion-icon>
    <ion-icon slot="end" style="margin-left:8px; " name="sunny"></ion-icon>
  </ion-range>
  <div slot="end" style="width: 60px; margin: 0px;" (click)="converters.lab.L = 50">{{ (converters.lab.L ? converters.lab.L : 0) | number: '1.2-2' }}</div>
</ion-item>
<ion-item>
  <div slot="start" style="width: 15px; margin: 0px;">A</div>
  <ion-range [(ngModel)]="converters.lab.A" min="-100" max="100" step="0.5" (ionChange)="change()">
    <ion-icon style="margin-right:8px; color:green;" slot="start" name="square"></ion-icon>
    <ion-icon style="margin-left:8px; color:red" slot="end" name="square"></ion-icon>
  </ion-range>
  <div slot="end" style="width: 60px; margin: 0px;" (click)="converters.lab.A = 0">{{ (converters.lab.A ? converters.lab.A : 0) | number: '1.2-2' }}</div>
</ion-item>
<ion-item>
  <div slot="start" style="width: 15px; margin: 0px;">B</div>
  <ion-range [(ngModel)]="converters.lab.B" min="-100" max="100" step="0.5" (ionChange)="change()">
    <ion-icon style="margin-right:8px; color:blue" slot="start" name="square"></ion-icon>
    <ion-icon style="margin-left:8px; color:yellow" slot="end" name="square"></ion-icon>
  </ion-range>
  <div slot="end" style="width: 60px; margin: 0px;" (click)="converters.lab.B = 0">{{ (converters.lab.B ? converters.lab.B : 0) | number: '1.2-2' }}</div>
</ion-item>
`,
  styles: [''],
})
export class LabsettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();

  constructor() {}

  ngOnInit() {}
  change() {
    this.colorChange.emit(this.converters.lab);
  }
}