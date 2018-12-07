import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IConverters, Rgb, Lab, Cmy, Cmyk, Lch, Hex, ConverterComparer, IRgb, ColorSpacesTypes, IColorSpace, CreateInstanceColorSpace } from '../color-library/color-space';

import * as chroma from 'chroma-js';
import { Thumbnail } from '@ionic/angular';
import { WorkConfigService } from '../work-config.service';
import { Storage } from '@ionic/storage';

const sizeWheel = 50;
const scale = 12;
const widthColorSpace = sizeWheel * scale;
const initial = widthColorSpace / 2;
const distanceLabel = 20;

@Component({
  selector: 'app-diferencia-color',
  templateUrl: './diferencia-color.page.html',
  styleUrls: ['./diferencia-color.page.scss'],
})
export class DiferenciaColorPage implements OnInit {
  @ViewChild('canvasDifColor') public canvas: ElementRef;

  numeric1: boolean;

  colorSpacesTypes = ColorSpacesTypes;
  colorSpaces = Object.keys(ColorSpacesTypes).filter(f => !isNaN(Number(f)));

  convertersMaster: ConverterComparer;
  fromColorSpaceMaster: string;
  convertersSample: ConverterComparer;
  fromColorSpaceSample: string;

  color1: { color: string; x: number; y: number; L?: number; A?: number; B?: number } = { color: '#000', x: initial, y: initial, L: 0 };
  color2: { color: string; x: number; y: number; L?: number; A?: number; B?: number } = { color: '#000', x: initial, y: initial, L: 0 };

  SelectColor1 = true;

  changeSelected(name: string, value: any) {
    this.storage.set(name, value);
  }

  constructor(public workConfigService: WorkConfigService, private storage: Storage) {
    this.convertersMaster = new ConverterComparer();
    this.convertersSample = new ConverterComparer();
  }

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    // this.convertersMaster = new ConverterComparer(await this.storage.get('color1DC'));

    let col: any = await this.storage.get('color1DC');
    let fr: string = (col.ColorSpaceName as string).toUpperCase();
    const color1 = CreateInstanceColorSpace(this.colorSpacesTypes[fr], { Lab: col, Rgb: col, Lch: col, Hex: col, CMYK: col });
    this.convertersMaster.updateFromColor(color1);

    let s = await this.storage.get('masterDC');
    this.fromColorSpaceMaster = s ? s : '1';

    // this.convertersSample = new ConverterComparer(await this.storage.get('color2DC'));
    col = await this.storage.get('color2DC');
    fr = (col.ColorSpaceName as string).toUpperCase();
    const color2 = CreateInstanceColorSpace(this.colorSpacesTypes[fr], { Lab: col, Rgb: col, Lch: col, Hex: col, CMYK: col });
    this.convertersSample.updateFromColor(color2);

    s = await this.storage.get('sampleDC');
    this.fromColorSpaceSample = s ? s : '1';

    const n1 = (await this.storage.get('numeric1DC')) as boolean;
    this.numeric1 = n1;

    this.draw();
  }

  share() {
    // ctx.save();
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.workConfigService.shareCanvas(canvasEl);
  }

  changeSelectedColorSpaceMaster() {
    this.changeColorMaster(this.convertersMaster[this.colorSpacesTypes[this.fromColorSpaceMaster].toLowerCase()]);
    this.storage.set('masterDC', this.fromColorSpaceMaster);
  }

  changeSelectedColorSpaceSample() {
    this.changeColorSample(this.convertersSample[this.colorSpacesTypes[this.fromColorSpaceSample].toLowerCase()]);
    this.storage.set('sampleDC', this.fromColorSpaceSample);
  }

  changeColorMaster(color: IColorSpace) {
    this.convertersMaster.updateFromColor(color);
    this.storage.set('color1DC', color);

    const col = color.To(ColorSpacesTypes.LAB) as Lab;
    this.color1.L = col.L;
    this.color1.A = col.A;
    this.color1.B = col.B;
    this.color1.color = chroma.lab(col.L, col.A, col.B).hex();

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const widthColorSpaceCM = canvasEl.clientWidth * (widthColorSpace / canvasEl.width);

    let x, y, x1, y1;
    x = (col.A * (widthColorSpaceCM / 2)) / 100 + widthColorSpaceCM / 2;
    y = ((col.B / -1) * (widthColorSpaceCM / 2)) / 100 + widthColorSpaceCM / 2;
    x1 = (x * canvasEl.width) / canvasEl.clientWidth;
    y1 = (y * canvasEl.height) / canvasEl.clientHeight;

    this.color1.x = x1;
    this.color1.y = y1;
    this.draw();
  }

  changeColorSample(color: IColorSpace) {
    this.convertersSample.updateFromColor(color);
    this.storage.set('color2DC', color);

    const col = color.To(ColorSpacesTypes.LAB) as Lab;
    this.color2.L = col.L;
    this.color2.A = col.A;
    this.color2.B = col.B;
    this.color2.color = chroma.lab(col.L, col.A, col.B).hex();

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const widthColorSpaceCS = canvasEl.clientWidth * (widthColorSpace / canvasEl.width);

    let x, y, x1, y1;
    x = (col.A * (widthColorSpaceCS / 2)) / 100 + widthColorSpaceCS / 2;
    y = ((col.B / -1) * (widthColorSpaceCS / 2)) / 100 + widthColorSpaceCS / 2;
    x1 = (x * canvasEl.width) / canvasEl.clientWidth;
    y1 = (y * canvasEl.height) / canvasEl.clientHeight;

    this.color2.x = x1;
    this.color2.y = y1;
    this.draw();
  }

  draw() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = canvasEl.getContext('2d');

    this.clearCanvas(canvasEl);
    ctx.font = 'normal 14px Arial';
    const cv = document.createElement('canvas');
    cv.width = sizeWheel;
    cv.height = sizeWheel;
    const ctxW = cv.getContext('2d');

    const bitmap = ctxW.getImageData(0, 0, sizeWheel, sizeWheel);

    for (let x = 0; x < sizeWheel; x++) {
      for (let y = 0; y < sizeWheel; y++) {
        const offset = 4 * (y * sizeWheel + x);
        const col = chroma.lab(this.color1.L, ((x - sizeWheel / 2) * 100) / (sizeWheel / 2), (((y - sizeWheel / 2) * 100) / (sizeWheel / 2)) * -1);
        bitmap.data[offset + 0] = col.rgb()[0]; // hsv[0];
        bitmap.data[offset + 1] = col.rgb()[1]; // hsv[1];
        bitmap.data[offset + 2] = col.rgb()[2]; // hsv[2];
        bitmap.data[offset + 3] = 255;
      }
    }

    ctxW.putImageData(bitmap, 0, 0);

    ctx.scale(scale, scale);
    ctx.drawImage(ctxW.canvas, 0, 0);
    ctx.scale(1 / scale, 1 / scale);
    ctx.beginPath();

    // Draw L Values and scale
    const gdL = ctx.createLinearGradient(widthColorSpace + 15, 0, widthColorSpace + 15, widthColorSpace);
    gdL.addColorStop(0, '#fff');
    gdL.addColorStop(1, '#000');

    ctx.fillStyle = gdL;
    ctx.strokeStyle = '#555';
    ctx.fillRect(widthColorSpace + 15, 0, 15, widthColorSpace);
    ctx.strokeRect(widthColorSpace + 15, 0, 15, widthColorSpace);

    ctx.beginPath();

    for (let yRule = 0; yRule <= widthColorSpace; yRule += widthColorSpace / 10) {
      ctx.moveTo(widthColorSpace + 30, yRule);
      ctx.lineTo(widthColorSpace + 40, yRule);

      ctx.moveTo(widthColorSpace + 30, yRule + widthColorSpace / 20);
      ctx.lineTo(widthColorSpace + 35, yRule + widthColorSpace / 20);
    }
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';

    let y1L, y2L, xL; // x2L;
    xL = widthColorSpace + 45;

    y1L = (widthColorSpace / 100) * (100 - this.color1.L) + 14;
    y2L = (widthColorSpace / 100) * (100 - this.color2.L) + 14;

    y1L += (y1L > y2L || y1L < 25) && y1L < widthColorSpace ? 0 : -14;
    if (!(y2L > y1L || y2L < 25)) {
      y2L += -14;
    } else {
      if (y1L < 26 + 14 && y2L < y1L + 15) {
        y2L = y1L + 14;
      } else if (y2L > widthColorSpace - 25) {
        if (y1L >= widthColorSpace - 28) {
          console.log('condicion2.1');

          y2L = y1L - 15;
        } else {
          y2L += -14;
        }
      }
    }

    ctx.fillText('ML:' + this.color1.L.toFixed(2), xL, y1L);
    ctx.fillText('SL:' + this.color2.L.toFixed(2), xL, y2L);

    ctx.beginPath();
    ctx.moveTo(widthColorSpace + 15, (widthColorSpace / 100) * (100 - this.color1.L));
    ctx.lineTo(widthColorSpace + 40, (widthColorSpace / 100) * (100 - this.color1.L));
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(widthColorSpace + 15, (widthColorSpace / 100) * (100 - this.color2.L));
    ctx.lineTo(widthColorSpace + 40, (widthColorSpace / 100) * (100 - this.color2.L));
    ctx.stroke();
    ctx.closePath();

    // Draw Rules
    const StrockColor = this.color1.L > 40 ? 20 : 200;

    ctx.strokeStyle = `rgba(${StrockColor},${StrockColor},${StrockColor},0.3)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(widthColorSpace / 2, 0);
    ctx.lineTo(widthColorSpace / 2, widthColorSpace);
    ctx.moveTo(0, widthColorSpace / 2);
    ctx.lineTo(widthColorSpace, widthColorSpace / 2);

    for (let yRule = 0; yRule < widthColorSpace; yRule += widthColorSpace / 20) {
      ctx.moveTo(widthColorSpace / 2 - 10, yRule);
      ctx.lineTo(widthColorSpace / 2 + 10, yRule);

      ctx.moveTo(widthColorSpace / 2 - 5, yRule + widthColorSpace / 40);
      ctx.lineTo(widthColorSpace / 2 + 5, yRule + widthColorSpace / 40);
    }

    for (let xRule = 0; xRule < widthColorSpace; xRule += widthColorSpace / 20) {
      ctx.moveTo(xRule, widthColorSpace / 2 - 10);
      ctx.lineTo(xRule, widthColorSpace / 2 + 10);

      ctx.moveTo(xRule + widthColorSpace / 40, widthColorSpace / 2 - 5);
      ctx.lineTo(xRule + widthColorSpace / 40, widthColorSpace / 2 + 5);
    }

    ctx.stroke();
    ctx.closePath();

    // draw circle colors

    const c1T = `M:{A: ${this.convertersMaster.lab.A.toFixed(2)}, B: ${this.convertersMaster.lab.B.toFixed(2)}}`;
    const c2T = `S:{A: ${this.convertersSample.lab.A.toFixed(2)}, B: ${this.convertersSample.lab.B.toFixed(2)}}`;
    const radio = 3;
    const sizeText = ctx.measureText(c1T);
    const sizeText2 = ctx.measureText(c2T);

    let x1, y1, x2, y2;
    let needMoveX, needMoveX2;
    if ((this.color1.x < this.color2.x || this.color1.x > widthColorSpace - sizeText.width) && this.color1.x > sizeText.width + distanceLabel) {
      x1 = this.color1.x - distanceLabel - sizeText.width;
    } else {
      x1 = this.color1.x + distanceLabel;
      needMoveX = true;
    }

    if ((this.color2.y < this.color1.y || this.color1.y < distanceLabel + 10) && this.color1.y < widthColorSpace - distanceLabel - 10) {
      y1 = this.color1.y + distanceLabel;
    } else {
      y1 = this.color1.y - distanceLabel;
    }

    if ((this.color2.x < this.color1.x || this.color2.x > widthColorSpace - sizeText2.width) && this.color2.x > sizeText2.width + distanceLabel) {
      x2 = this.color2.x - distanceLabel - sizeText2.width;
    } else {
      x2 = this.color2.x + distanceLabel;
      needMoveX2 = true;
    }

    if ((this.color2.y < this.color1.y && !(this.color2.y < distanceLabel + 10)) || this.color2.y > widthColorSpace - distanceLabel - 10) {
      y2 = this.color2.y - distanceLabel;
    } else {
      y2 = this.color2.y + distanceLabel;
    }

    // Master
    ctx.strokeStyle = `rgba(${StrockColor},${StrockColor},${StrockColor},1)`;
    ctx.fillStyle = this.color1.color;

    ctx.beginPath();
    ctx.moveTo(x1, y1 + 2);
    ctx.lineTo(x1 + sizeText.width, y1 + 2);
    if (needMoveX) {
      ctx.moveTo(x1, y1 + 2);
    }
    ctx.lineTo(this.color1.x, this.color1.y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.color1.x, this.color1.y, radio, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = `rgba(${StrockColor},${StrockColor},${StrockColor},1)`;
    ctx.fillText(c1T, x1, y1);

    // Sample

    ctx.strokeStyle = `rgba(${StrockColor},${StrockColor},${StrockColor},1)`;
    ctx.fillStyle = this.color2.color;

    ctx.beginPath();
    ctx.moveTo(x2, y2 + 2);
    ctx.lineTo(x2 + sizeText.width, y2 + 2);
    if (needMoveX2) {
      ctx.moveTo(x2, y2 + 2);
    }
    ctx.lineTo(this.color2.x, this.color2.y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.color2.x, this.color2.y, radio, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = `rgba(${StrockColor},${StrockColor},${StrockColor},1)`;
    ctx.fillText(c2T, x2, y2);

    // Square Colors
    ctx.fillStyle = this.color1.color;
    ctx.fillRect(widthColorSpace + 100, 50, 150, 150);
    ctx.fillStyle = this.color2.color;
    ctx.fillRect(widthColorSpace + 250, 50, 150, 150);
  }

  private clearCanvas(canvasEl: HTMLCanvasElement) {
    // Limpio el canvas
    if (canvasEl.getContext) {
      const cx = canvasEl.getContext('2d');
      cx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      cx.beginPath();
      cx.fillStyle = '#fff';
      cx.fillRect(0, 0, canvasEl.width, canvasEl.height);
      cx.fill();
      cx.closePath();
    }
  }
}
