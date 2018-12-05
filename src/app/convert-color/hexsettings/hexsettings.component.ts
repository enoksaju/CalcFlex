import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-hexsettings',
  templateUrl: './hexsettings.component.html',
  styleUrls: ['./hexsettings.component.scss']
})
export class HexsettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  change() {
    this.colorChange.emit(this.converters.rgb);
  }
  constructor() { }

  ngOnInit() {
  }

}
