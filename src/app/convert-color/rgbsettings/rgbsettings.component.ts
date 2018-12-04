import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Rgb, ColorSpacesTypes, Hex, IConverters, Cmy, Cmyk, Lab, Lch, Xyz, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-rgbsettings',
  templateUrl: './rgbsettings.component.html',
  styleUrls: ['./rgbsettings.component.scss'],
})
export class RgbsettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();

  constructor() {}
  ngOnInit() {}
  change() {
    this.colorChange.emit(this.converters.rgb);
  }
}
