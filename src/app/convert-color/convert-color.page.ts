import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ColorSpacesTypes, Rgb, Lab, Xyz, Cmy, Cmyk, Lch, Hex, IConverters, IColorSpace } from '../color-library/color-space';
import { WorkConfigService } from '../work-config.service';
import { RgbsettingsComponent } from './settings/rgbsettings.component';
import { Storage } from '@ionic/storage';

const TRASPARENTE_RGBA = 'rgba(0,0,0,0)';
const NORMAL = 'normal 24px Roboto';
const BOLD = 'bold 26px Roboto';
const NORMAL_COLOR = 'normal 38px Roboto';
const BOLD_COLOR = 'bold 45px Roboto';
const LABEL_COLOR = 'rgba(10, 60, 100,0.8)';
const CONCTENT_COLOR = 'rgba(0, 0, 0,0.7)';

@Component({
  selector: 'app-convert-color',
  templateUrl: './convert-color.page.html',
  styleUrls: ['./convert-color.page.scss'],
})
export class ConvertColorPage implements OnInit, OnDestroy {
  @ViewChild('rgbConverter') rgbC: RgbsettingsComponent;
  @ViewChild('canvasColorConverter') public canvas: ElementRef;

  converters: IConverters = {
    rgb: new Rgb().initialize({ R: 0, G: 0, B: 0 }),
    lab: new Lab().initialize({ R: 0, G: 0, B: 0 }),
    cmy: new Cmy().initialize({ R: 0, G: 0, B: 0 }),
    cmyk: new Cmyk().initialize({ R: 0, G: 0, B: 0 }),
    lch: new Lch().initialize({ R: 0, G: 0, B: 0 }),
    hex: new Hex().initialize({ R: 0, G: 0, B: 0 }),
  };

  colorSpacesTypes = ColorSpacesTypes;
  colorSpaces = Object.keys(ColorSpacesTypes).filter(f => !isNaN(Number(f)));

  fromColorSpace_color: IColorSpace = this.converters.rgb;
  fromColorSpace = '0';

  constructor(public workConfigService: WorkConfigService, private storage: Storage) {}
  ngOnInit() {
    this.drawCanvas();

    this.storage.get('convS').then(s => {
      this.fromColorSpace = s ? s : '0';
    });
  }
  ngOnDestroy(): void {
    this.storage.set('convS', this.fromColorSpace);
  }

  colorFromRgb(): string {
    const color = `rgb(${this.converters.rgb.R}, ${this.converters.rgb.G}, ${this.converters.rgb.B})`;
    return color;
  }

  changeSelected() {
    this.colorChange(this.converters[this.colorSpacesTypes[this.fromColorSpace].toLowerCase()]);
    this.storage.set('convS', this.fromColorSpace);
  }
  colorChange(colorSpace: IColorSpace) {
    this.fromColorSpace_color = colorSpace;
    this.converters.cmy = colorSpace.To(ColorSpacesTypes.CMY) as Cmy;
    this.converters.cmyk = colorSpace.To(ColorSpacesTypes.CMYK) as Cmyk;
    this.converters.hex = colorSpace.To(ColorSpacesTypes.HEX) as Hex;
    this.converters.lab = colorSpace.To(ColorSpacesTypes.LAB) as Lab;
    this.converters.lch = colorSpace.To(ColorSpacesTypes.LCH) as Lch;
    this.converters.rgb = colorSpace.To(ColorSpacesTypes.RGB) as Rgb;
    this.drawCanvas();
  }

  drawCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const cx: CanvasRenderingContext2D = canvasEl.getContext('2d');

    this.clearCanvas(canvasEl);

    let grd = cx.createLinearGradient(380, 300, 80, 300);

    cx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    cx.fillStyle = this.converters.hex.Code;
    cx.strokeStyle = '#555';

    const pt1 = new Path2D(`M 506.39959,171.5674 A 223.86568,73.335312 0 0 1 282.53392,244.90271 223.86568,73.335312 0 0 1 58.668235,171.5674 223.86568,73.335312 0 0 1 282.53392,98.232086 223.86568,73.335312 0 0 1 506.39959,171.5674 Z`);
    cx.fill(pt1);
    cx.stroke(pt1);

    const pt2 = new Path2D(
      `m 505.62765,216.34053 c 0,40.50197 -100.22808,73.33531 -223.86568,73.33531 -123.6376,0 -223.86568,-32.83334 -223.865677,-73.33531 10e-7,
      -17.91797 -0.192988,1.92988 0.862609,-46.30049 -0.862609,46.30049 115.069348,75.3746 223.389048,74.09071 107.07562,-1.26914 227.69824,
      -24.8227 224.64737,-76.40567 -1.16767,48.61545 -1.16767,39.26102 -1.16767,48.61545 z`,
    );
    cx.fillStyle = `rgba(${this.converters.rgb.R}, ${this.converters.rgb.G}, ${this.converters.rgb.B},1)`;
    cx.fill(pt2);

    grd = cx.createLinearGradient(380, 300, 80, 300);
    grd.addColorStop(0, 'rgba(0,0,0,0.8)');
    grd.addColorStop(0.2, 'rgba(0,0,0,0.5)');
    grd.addColorStop(0.75, 'rgba(180,180,180,0.5)');
    grd.addColorStop(0.85, 'rgba(255,255,255,0.7)');
    grd.addColorStop(0.95, 'rgba(180,180,180,0.5)');
    grd.addColorStop(1, 'rgba(180,180,180,0.5)');
    cx.fillStyle = grd;

    // cx.fillStyle = `rgba(0,0,0,0.5)`;
    cx.fill(pt2);
    cx.stroke(pt2);

    const pt5 = new Path2D(
      'm 663.19338,20.56011 298.61336,0 c 12.53883,0 22.63326,11.464517 22.63326,25.705195 l 0,512.469495 c 0,14.24068 -10.09443,25.70519 -22.63326,25.70519 l -298.61336,0 c -12.53883,0 -22.63326,-11.46451 -22.63326,-25.70519 l 0,-512.469495 c 0,-14.240678 10.09443,-25.705195 22.63326,-25.705195 z',
    );

    cx.shadowColor = '#555';
    cx.fillStyle = '#eee';
    cx.strokeStyle = '#335';
    cx.shadowBlur = 15;
    cx.shadowOffsetX = 8;
    cx.shadowOffsetY = 8;

    cx.fill(pt5);
    cx.shadowColor = TRASPARENTE_RGBA;
    cx.stroke(pt5);

    cx.fillStyle = LABEL_COLOR;
    cx.font = BOLD_COLOR;
    cx.fillText(this.fromColorSpace_color.ColorSpaceName.toUpperCase(), 280 - cx.measureText(this.fromColorSpace_color.ColorSpaceName.toUpperCase()).width / 2, 380);
    cx.fillStyle = CONCTENT_COLOR;
    cx.font = NORMAL_COLOR;
    cx.fillText(this.fromColorSpace_color.ToString(), 280 - cx.measureText(this.fromColorSpace_color.ToString()).width / 2, 455);

    this.writeResults([this.converters.rgb, this.converters.cmy, this.converters.cmyk, this.converters.hex, this.converters.lab, this.converters.lch], cx);
  }

  private clearCanvas(canvasEl: HTMLCanvasElement) {
    const cx: CanvasRenderingContext2D = canvasEl.getContext('2d');
    // Limpio el canvas
    cx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    cx.beginPath();
    cx.fillStyle = '#fff';
    cx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    cx.fill();
    cx.closePath();
  }

  private writeResults(colors: IColorSpace[], cx: CanvasRenderingContext2D) {
    const validColors = colors.filter(c => c.ColorSpaceName !== this.fromColorSpace_color.ColorSpaceName);
    const x = 650;
    let y = 60;

    validColors.forEach(color => {
      cx.fillStyle = LABEL_COLOR;
      cx.font = BOLD;
      cx.fillText(`${color.ColorSpaceName}:`, x, y);

      cx.fillStyle = CONCTENT_COLOR;
      cx.font = NORMAL;
      cx.fillText(`${color.ToString()}`, x, y + 30);

      y += 90;
    });
  }

  share() {
    // ctx.save();
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.workConfigService.shareCanvas(canvasEl);
  }
}
