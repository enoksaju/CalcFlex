import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IConverters, Rgb, Lab, Cmy, Cmyk, Lch, Hex, ConverterComparer, IRgb, ColorSpacesTypes, IColorSpace } from '../color-library/color-space';

import * as chroma from 'chroma-js';
import { Thumbnail } from '@ionic/angular';
import { WorkConfigService } from '../work-config.service';

const sizeWheel = 50;
const scale = 12;
const initial = (sizeWheel * scale) / 2;
const distanceLabel = 20;

@Component({
  selector: 'app-diferencia-color',
  templateUrl: './diferencia-color.page.html',
  styleUrls: ['./diferencia-color.page.scss'],
})
export class DiferenciaColorPage implements OnInit {
  @ViewChild('canvasDifColor') public canvas: ElementRef;

  colorSpacesTypes = ColorSpacesTypes;
  colorSpaces = Object.keys(ColorSpacesTypes).filter(f => !isNaN(Number(f)));

  convertersMaster: ConverterComparer;
  fromColorSpaceMaster = '1';
  convertersSample: ConverterComparer;
  fromColorSpaceSample = '1';

  color1: { color: string; x: number; y: number; L?: number; A?: number; B?: number } = { color: '#000', x: initial, y: initial, L: 0 };
  color2: { color: string; x: number; y: number; L?: number; A?: number; B?: number } = { color: '#000', x: initial, y: initial, L: 0 };

  SelectColor1 = true;

  constructor(public workConfigService: WorkConfigService) {
    this.convertersMaster = new ConverterComparer();
    this.convertersSample = new ConverterComparer();
  }

  ngOnInit() {
    this.draw();
  }
  share() {
    // ctx.save();
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.workConfigService.shareCanvas(canvasEl);
  }

  changeColorMaster(color: IColorSpace) {
    this.convertersMaster.updateFromColor(color);
    const col = color.To(ColorSpacesTypes.LAB) as Lab;
    this.color1.L = col.L;
    this.color1.A = col.A;
    this.color1.B = col.B;
    this.color1.color = chroma.lab(col.L, col.A, col.B).hex();

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const widthColorSpace = canvasEl.clientWidth * ((sizeWheel * scale) / canvasEl.width);

    let x, y, x1, y1;
    x = (col.A * (widthColorSpace / 2)) / 100 + widthColorSpace / 2;
    y = ((col.B / -1) * (widthColorSpace / 2)) / 100 + widthColorSpace / 2;
    x1 = (x * canvasEl.width) / canvasEl.clientWidth;
    y1 = (y * canvasEl.height) / canvasEl.clientHeight;

    this.color1.x = x1;
    this.color1.y = y1;
    console.log(`{A:${col.A} B:${col.B}}, widthColorSpace: ${widthColorSpace}`);
    this.draw();
  }

  changeColorSample(color: IColorSpace) {
    this.convertersSample.updateFromColor(color);
    const col = color.To(ColorSpacesTypes.LAB) as Lab;
    this.color2.L = col.L;
    this.color2.A = col.A;
    this.color2.B = col.B;
    this.color2.color = chroma.lab(col.L, col.A, col.B).hex();

    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const widthColorSpace = canvasEl.clientWidth * ((sizeWheel * scale) / canvasEl.width);

    let x, y, x1, y1;
    x = (col.A * (widthColorSpace / 2)) / 100 + widthColorSpace / 2;
    y = ((col.B / -1) * (widthColorSpace / 2)) / 100 + widthColorSpace / 2;
    x1 = (x * canvasEl.width) / canvasEl.clientWidth;
    y1 = (y * canvasEl.height) / canvasEl.clientHeight;

    this.color2.x = x1;
    this.color2.y = y1;
    console.log(`{A:${col.A} B:${col.B}}, widthColorSpace: ${widthColorSpace}`);
    this.draw();
  }

  draw() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = canvasEl.getContext('2d');
    this.clearCanvas(canvasEl);

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

    const StrockColor = this.color1.L > 40 ? 20 : 200;

    ctx.strokeStyle = `rgba(${StrockColor},${StrockColor},${StrockColor},0.3)`;
    ctx.lineWidth = 1;
    ctx.moveTo((sizeWheel * scale) / 2, 0);
    ctx.lineTo((sizeWheel * scale) / 2, sizeWheel * scale);
    ctx.moveTo(0, (sizeWheel * scale) / 2);
    ctx.lineTo(sizeWheel * scale, (sizeWheel * scale) / 2);

    for (let yRule = 0; yRule < sizeWheel * scale; yRule += 10) {
      ctx.moveTo((sizeWheel * scale) / 2 - 5, yRule);
      ctx.lineTo((sizeWheel * scale) / 2 + 5, yRule);
    }

    for (let xRule = 0; xRule < sizeWheel * scale; xRule += 10) {
      ctx.moveTo(xRule, (sizeWheel * scale) / 2 - 5);
      ctx.lineTo(xRule, (sizeWheel * scale) / 2 + 5);
    }

    ctx.stroke();

    // draw circle colors

    // Master
    ctx.font = 'normal 10px Arial';

    const widthColorSpace = sizeWheel * scale;
    const sizeText = ctx.measureText(this.convertersMaster.lab.ToString());

    let x1, y1;
    let needMoveX;
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
    ctx.arc(this.color1.x, this.color1.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = `rgba(${StrockColor},${StrockColor},${StrockColor},1)`;
    ctx.fillText(this.convertersMaster.lab.ToString(), x1, y1);

    // Sample
    ctx.fillStyle = this.color2.color;
    ctx.beginPath();
    ctx.arc(this.color2.x, this.color2.y, 10, 0, 2 * Math.PI);

    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    // Square Colors
    ctx.fillStyle = this.color1.color;
    ctx.fillRect(sizeWheel * scale + 100, 50, 150, 150);
    ctx.fillStyle = this.color2.color;
    ctx.fillRect(sizeWheel * scale + 250, 50, 150, 150);
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
