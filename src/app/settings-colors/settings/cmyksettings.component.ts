import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-cmyksettings',
  template: `
    <ng-container *ngIf="active">
      <ng-container *ngIf="!numeric; else: tL">
        <ion-item>
          <ion-range [(ngModel)]="converters.cmyk.C" color="cyan" min="0" max="1" step="0.01" (ionChange)="change()">
          </ion-range>
          <div slot="end" style="width: 40px; margin: 0px;" (click)="converters.cmyk.C = 1">
            {{ (converters.cmyk.C ? converters.cmyk.C : 0) | percent: '1.0-0' }}
          </div>
        </ion-item>
        <ion-item>
          <ion-range [(ngModel)]="converters.cmyk.M" color="magent" min="0" max="1" step="0.01" (ionChange)="change()">
          </ion-range>
          <div slot="end" style="width: 40px; margin: 0px;" (click)="converters.cmyk.M = 1">
            {{ (converters.cmyk.M ? converters.cmyk.M : 0) | percent: '1.0-0' }}
          </div>
        </ion-item>
        <ion-item>
          <ion-range [(ngModel)]="converters.cmyk.Y" color="yellow" min="0" max="1" step="0.01" (ionChange)="change()">
          </ion-range>
          <div slot="end" style="width: 40px; margin: 0px;" (click)="converters.cmyk.Y = 1">
            {{ (converters.cmyk.Y ? converters.cmyk.Y : 0) | percent: '1.0-0' }}
          </div>
        </ion-item>
        <ion-item>
          <ion-range [(ngModel)]="converters.cmyk.K" color="dark" min="0" max="1" step="0.01" (ionChange)="change()">
          </ion-range>
          <div slot="end" style="width: 40px; margin: 0px;" (click)="converters.cmyk.K = 1">
            {{ (converters.cmyk.K ? converters.cmyk.K : 0) | percent: '1.0-0' }}
          </div>
        </ion-item>
      </ng-container>
      <ng-template #tL>
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label color="cyan" text-right>C</ion-label>
                <ion-input
                  [(ngModel)]="converters.cmyk.C"
                  min="0"
                  step="0.01"
                  max="1"
                  type="number"
                  (ionChange)="change()"
                ></ion-input>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item>
                <ion-label color="magent" text-right>M</ion-label>
                <ion-input
                  [(ngModel)]="converters.cmyk.M"
                  min="0"
                  step="0.01"
                  max="1"
                  type="number"
                  (ionChange)="change()"
                ></ion-input>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item>
                <ion-label color="yellow" text-right>Y</ion-label>
                <ion-input
                  [(ngModel)]="converters.cmyk.Y"
                  min="0"
                  step="0.01"
                  max="1"
                  type="number"
                  (ionChange)="change()"
                ></ion-input>
              </ion-item>
            </ion-col>
            <ion-col>
              <ion-item>
                <ion-label color="dark" text-right>K</ion-label>
                <ion-input
                  [(ngModel)]="converters.cmyk.K"
                  min="0"
                  step="0.01"
                  max="1"
                  type="number"
                  (ionChange)="change()"
                ></ion-input>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ng-template>
    </ng-container>
  `,
  styles: ['']
})
export class CmyksettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  @Input() numeric = false;
  @Input() active = false;
  change() {
    if (this.active) {
      this.colorChange.emit(this.converters.cmyk);
    }
  }
  constructor() {}

  ngOnInit() {}
}
