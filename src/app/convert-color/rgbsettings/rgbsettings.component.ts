import { Component, OnInit, Input } from '@angular/core';
import { Rgb, ColorSpacesTypes, Hex, ColorSpace, IColorSpace, IConverters, Cmy, Cmyk, Lab, Lch, Xyz } from '../../color-library/color-space';

@Component({
  selector: 'app-rgbsettings',
  templateUrl: './rgbsettings.component.html',
  styleUrls: ['./rgbsettings.component.scss'],
})
export class RgbsettingsComponent implements OnInit {
  @Input() converters: IConverters;

  // rgb: Rgb = Rgb.create({ R: 0, G: 0, B: 0 });
  // converted: IColorSpace;

  constructor() {
    console.log(this.converters);
  }

  ngOnInit() {}

  change() {
    this.converters.cmy = this.converters.rgb.To(ColorSpacesTypes.CMY) as Cmy;
    this.converters.cmyk = this.converters.rgb.To(ColorSpacesTypes.CMYK) as Cmyk;
    this.converters.hex = this.converters.rgb.To(ColorSpacesTypes.HEX) as Hex;
    this.converters.lab = this.converters.rgb.To(ColorSpacesTypes.LAB) as Lab;
    this.converters.lch = this.converters.rgb.To(ColorSpacesTypes.LCH) as Lch;
    this.converters.rgb = this.converters.rgb.To(ColorSpacesTypes.RGB) as Rgb;
    this.converters.xyz = this.converters.rgb.To(ColorSpacesTypes.XYZ) as Xyz;

    // const color: ColorSpacesTypes = ColorSpacesTypes[ColorSpacesTypes[this.toConvert]];
    // return this.converters.rgb.To(color);
  }
}
