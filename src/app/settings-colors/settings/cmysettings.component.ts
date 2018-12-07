import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-cmysettings',
  template: `
    <ng-container *ngIf="active">
      <ng-container *ngIf="!numeric; else: tL">
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
      </ng-container>
      <ng-template #tL>
        <ion-item>
          <ion-label color="cyan" position="fixed" text-right>Cyan</ion-label>
          <ion-input [(ngModel)]="converters.cmy.C" min="0" step="0.01" max="1" type="number" (ionChange)="change()"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label color="magent" position="fixed" text-right>Magenta</ion-label>
          <ion-input [(ngModel)]="converters.cmy.M" min="0" step="0.01" max="1" type="number" (ionChange)="change()"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label color="yellow" position="fixed" text-right>Amarillo</ion-label>
          <ion-input [(ngModel)]="converters.cmy.Y" min="0" step="0.01" max="1" type="number" (ionChange)="change()"></ion-input>
        </ion-item>
      </ng-template>
    </ng-container>
  `,
  styles: [''],
})
export class CmysettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  @Input() numeric = false;
  @Input() active = false;
  change() {
    if (this.active) {
      this.colorChange.emit(this.converters.cmy);
    }
  }
  constructor() {}

  ngOnInit() {}
}
