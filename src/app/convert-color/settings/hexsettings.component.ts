import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-hexsettings',
  template: `
    <ion-item>
      <ion-label position="fixed">Codigo:</ion-label>
      <ion-input type="text" #hexCode [(ngModel)]="converters.hex.Code" placeholder="#000000" (ionChange)="change(hexCode.value)"></ion-input>
    </ion-item>
    <ion-item *ngIf="!checkPattern(hexCode.value)"> <ion-note color="danger">El codigo Hexadecimal es incorrecto </ion-note> </ion-item>
  `,
  styles: [''],
})
export class HexsettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();

  change(val: string) {
    if (this.checkPattern(val)) {
      this.converters.hex.Code = val;
      this.colorChange.emit(this.converters.hex);
    }
  }

  checkPattern(val: string): boolean {
    return /^(#){0,1}([0-9A-Fa-f]{6,6})$/g.test(val);
  }

  constructor() {}

  ngOnInit() {}
}
