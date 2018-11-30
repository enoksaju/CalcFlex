import { Component, OnInit, ViewChild } from '@angular/core';
import { ColorSpacesTypes, Rgb, Lab, Xyz, Cmy, Cmyk, Lch, Hex, IConverters } from '../color-library/color-space';
import { RgbsettingsComponent } from './rgbsettings/rgbsettings.component';

@Component({
  selector: 'app-convert-color',
  templateUrl: './convert-color.page.html',
  styleUrls: ['./convert-color.page.scss'],
})
export class ConvertColorPage implements OnInit {
  @ViewChild('rgbConverter') rgbC: RgbsettingsComponent;

  converters: IConverters = {
    rgb: new Rgb().initialize({ R: 0, G: 0, B: 0 }),
    lab: new Lab().initialize({ R: 0, G: 0, B: 0 }),
    xyz: new Xyz().initialize({ R: 0, G: 0, B: 0 }),
    cmy: new Cmy().initialize({ R: 0, G: 0, B: 0 }),
    cmyk: new Cmyk().initialize({ R: 0, G: 0, B: 0 }),
    lch: new Lch().initialize({ R: 0, G: 0, B: 0 }),
    hex: new Hex().initialize({ R: 0, G: 0, B: 0 }),
  };

  colorSpacesTypes = ColorSpacesTypes;
  colorSpaces = Object.keys(ColorSpacesTypes).filter(f => !isNaN(Number(f)));

  fromColorSpace = '0';
  constructor() {}
  ngOnInit() {}

  colorFromRgb(): string {
    const color = `rgb(${this.converters.rgb.R}, ${this.converters.rgb.G}, ${this.converters.rgb.B})`;
    return color;
  }
}
