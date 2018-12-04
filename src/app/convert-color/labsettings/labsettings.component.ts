import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-labsettings',
  templateUrl: './labsettings.component.html',
  styleUrls: ['./labsettings.component.scss'],
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
