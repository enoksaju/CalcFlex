import { Component, OnInit, OnDestroy, SecurityContext, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ModalController, Tabs, Tab } from '@ionic/angular';
import { ConfigWorkComponent } from '../modals/config-work/config-work.component';
import { WorkConfigService, IWorkConfig, resultData } from '../work-config.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DomSanitizer } from '@angular/platform-browser';

const TRASPARENTE_RGBA = 'rgba(0,0,0,0)';
const NORMAL = 'normal 24px Roboto';
const BOLD = 'bold 26px Roboto';
const labelColor = 'rgba(10, 60, 100,0.8)';
const contentColor = 'rgba(0, 0, 0,0.7)';

interface ItwoColumnsArg {
  label: string;
  value: number;
  decimals: number;
  unidad?: string;
  optionalLine?: string;
}

@Component({
  selector: 'app-metros-lineales',
  templateUrl: './metros-lineales.page.html',
  styleUrls: ['./metros-lineales.page.scss'],
})
export class MetrosLinealesPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvasAlto') public canvas: ElementRef;
  tab = 'fromkg';
  private cx: CanvasRenderingContext2D;

  CurrentWork: IWorkConfig;
  $CurrentWork: Subscription;

  constructor(public modalController: ModalController, public workConfigService: WorkConfigService) {}

  ngOnInit() {
    this.$CurrentWork = this.workConfigService.WorkConfig().subscribe(u => (this.CurrentWork = u));
    // this.tabs.select('tab-kgml');
  }
  ngOnDestroy() {
    this.$CurrentWork.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.drawCanvas();
  }

  private wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }

  drawCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    const ctx = this.cx;

    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    ctx.beginPath();

    // Clear Canvas
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#335';
    ctx.shadowColor = TRASPARENTE_RGBA;
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.fill();
    ctx.closePath();

    // #region DrawRoll

    let grd = ctx.createLinearGradient(180, 480, 350, 610);
    grd.addColorStop(0, 'rgb(20,20,40)');
    grd.addColorStop(0.08, 'rgb(40,40,80)');
    grd.addColorStop(0.6, 'rgb(180,180,255)');
    grd.addColorStop(1, 'rgb(50,50,100)');
    ctx.fillStyle = grd;

    const pt1 = new Path2D('m 358.60416,304.53038 155.9732,8.64577 -139.05293,206.9413 -238.08055,-22.61637 c 33.43512,1.23256 53.88785,-22.93327 61.61382,-31.43606 z');
    ctx.fill(pt1);

    grd = ctx.createLinearGradient(255, 450, 300, 490);
    grd.addColorStop(0, 'rgba(40,40,80,0.5)');
    grd.addColorStop(0.8, TRASPARENTE_RGBA);
    grd.addColorStop(1, TRASPARENTE_RGBA);
    ctx.fillStyle = grd;

    ctx.fill(pt1);
    ctx.stroke(pt1);

    grd = ctx.createLinearGradient(40, 0, 300, 10);
    grd.addColorStop(0, 'rgb(50,50,100)');
    grd.addColorStop(0.4, 'rgb(180,180,255)');
    grd.addColorStop(1, 'rgb(30,30,60)');
    ctx.fillStyle = grd;

    const pt2 = new Path2D('M 248.54619,303.91987 A 108.62834,193.62834 0 0 1 139.91784,497.54822 108.62834,193.62834 0 0 1 31.289498,303.91987 108.62834,193.62834 0 0 1 139.91784,110.29153 108.62834,193.62834 0 0 1 248.54619,303.91987 Z');
    ctx.fill(pt2);
    ctx.stroke(pt2);

    grd = ctx.createLinearGradient(280, 310, 160, 190);
    grd.addColorStop(0, 'white');
    grd.addColorStop(1, 'black');
    ctx.fillStyle = grd;

    const pt3 = new Path2D('m 179.80716,304.02531 a 41.921329,78.791901 0 0 1 -41.92133,78.7919 41.921329,78.791901 0 0 1 -41.921333,-78.7919 41.921329,78.791901 0 0 1 41.921333,-78.7919 41.921329,78.791901 0 0 1 41.92133,78.7919 z');
    ctx.fill(pt3);
    ctx.stroke(pt3);

    grd = ctx.createLinearGradient(290, 310, 210, 180);
    grd.addColorStop(0, 'rgb(40,40,80)');
    grd.addColorStop(1, 'rgb(180,180,255)');
    ctx.fillStyle = grd;

    const pt4 = new Path2D(
      `M 119.198,113.10647 313.32932,47.814212 c 0,0 33.16755,-8.17714 55.32301,29.12735 7.36264,12.39693 30.4149,45.902428 27.48987,124.531128 
      -5.16829,70.67405 -37.03296,101.54247 -37.03296,101.54247 L 197.65175,467.82112 c 0,0 45.79849,-46.09935 50.19331,-143.91899 C 251.76368,247.16652 
      232.09152,179.063 197.84122,139.30737 161.99186,97.695642 119.198,113.10647 119.198,113.10647 Z`,
    );
    ctx.fill(pt4);
    ctx.stroke(pt4);

    const pt5 = new Path2D(
      'm 663.19338,20.56011 298.61336,0 c 12.53883,0 22.63326,11.464517 22.63326,25.705195 l 0,512.469495 c 0,14.24068 -10.09443,25.70519 -22.63326,25.70519 l -298.61336,0 c -12.53883,0 -22.63326,-11.46451 -22.63326,-25.70519 l 0,-512.469495 c 0,-14.240678 10.09443,-25.705195 22.63326,-25.705195 z',
    );

    ctx.shadowColor = '#555';
    ctx.fillStyle = '#eee';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;

    ctx.fill(pt5);
    ctx.shadowColor = TRASPARENTE_RGBA;
    ctx.stroke(pt5);
    
    // #endregion

    
    ctx.beginPath();
    
    ctx.shadowColor = '#555';
    // Ancho
    ctx.lineWidth = 4;
    ctx.font = 'normal 30px Arial';
    ctx.strokeStyle = 'rgba(46, 204, 113,0.8)';
    ctx.fillStyle = 'rgba(26, 82, 118,0.8)';

    ctx.moveTo(400, 525);
    ctx.lineTo(540, 315);

    ctx.moveTo(400, 510);
    ctx.lineTo(400, 525);
    ctx.lineTo(415, 515);

    ctx.moveTo(525, 323);
    ctx.lineTo(540, 315);
    ctx.lineTo(540, 330);

    ctx.save();
    ctx.translate(480, 465);
    ctx.rotate(-Math.PI / 3);
    ctx.transform(1, 0, 0.5, 1, 0, 0);
    ctx.fillText(`${this.CurrentWork.Ancho} cm`, 0, 0);
    ctx.restore();

    // Metros
    ctx.moveTo(420, 300);
    ctx.lineTo(440, 263);
    ctx.lineTo(600, 275);
    ctx.moveTo(415, 300);
    ctx.lineTo(427, 300);

    const m = (this.CurrentWork.Metros ? this.CurrentWork.Metros : 0).toLocaleString('es-MX', { style: 'decimal', useGrouping: true, minimumFractionDigits: 0 });

    ctx.save();
    ctx.transform(1, 0.09, 0.1, 1, 0, 0);
    ctx.fillText(`${m} m`, 570 - ctx.measureText(m).width, 205);
    ctx.restore();
    ctx.stroke();
    ctx.closePath();

    // Cantidad
    ctx.beginPath();

    ctx.font = 'bold 35px Roboto';
    const KgRollo = `${(this.CurrentWork.Cantidad ? this.CurrentWork.Cantidad : 0).toFixed(2)} Kg`;
    ctx.fillStyle = 'rgba(50, 130, 200,0.8)';

    ctx.save();
    // ctx.transform(1, 0.08, 0.1, 1, 0, 0);

    ctx.shadowColor = '#555';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 5;
    ctx.fillText(KgRollo, 510 - ctx.measureText(KgRollo).width / 2, 80);

    ctx.restore();

    ctx.closePath();

    // Material
    ctx.shadowColor = TRASPARENTE_RGBA;
    ctx.fillStyle = '#222';

    ctx.fillStyle = labelColor;
    ctx.font = BOLD;
    ctx.fillText('Material:', 670, 80);
    ctx.fillStyle = contentColor;
    ctx.font = NORMAL;
    this.wrapText(ctx, `(${this.CurrentWork.Material.Abreviatura}) ${this.CurrentWork.Material.Nombre}`, 670, 110, 295, 25);
    this.twoColumnsText(ctx, 670, 200, { label: 'Calibre', value: this.CurrentWork.Calibre, decimals: 2, unidad: 'µm' }, { label: 'Ancho', value: this.CurrentWork.Ancho, decimals: 2, unidad: 'cm' });
    this.twoColumnsText(ctx, 670, 270, { label: 'Tinta', value: this.CurrentWork.Tinta, decimals: 2, unidad: 'g/m²' }, { label: 'Velocidad', value: this.CurrentWork.Velocidad, decimals: 0, unidad: 'm/min' });
    this.twoColumnsText(ctx, 670, 370, { label: 'Largo', value: this.CurrentWork.Metros, decimals: 0, unidad: 'm' }, { label: 'm²', value: this.CurrentWork.mt2Totales, decimals: 0, unidad: 'm²' });
    this.twoColumnsText(
      ctx,
      670,
      440,
      {
        label: 'Tiempo',
        value: this.CurrentWork.Tiempo,
        decimals: 0,
        unidad: 'min',
        optionalLine: `${Math.floor(Math.round(this.CurrentWork.Tiempo) / 60)}:${Math.floor(Math.round(this.CurrentWork.Tiempo) % 60).toLocaleString('es-MX', { minimumIntegerDigits: 2 })} hrs`,
      },
      { label: 'Kg/h', value: this.CurrentWork.Tiempo, decimals: 0, unidad: 'Kg/h' },
    );
  }

  private twoColumnsText(cx, x: number, y: number, arg1: ItwoColumnsArg = { label: '', value: 0, decimals: 0 }, arg2: ItwoColumnsArg = { label: '', value: 0, decimals: 0 }) {
    const val1 = (arg1.value ? arg1.value : 0).toLocaleString('es-MX', { style: 'decimal', useGrouping: true, minimumFractionDigits: arg1.decimals, maximumFractionDigits: arg1.decimals });
    const val2 = (arg2.value ? arg2.value : 0).toLocaleString('es-MX', { style: 'decimal', useGrouping: true, minimumFractionDigits: arg2.decimals, maximumFractionDigits: arg2.decimals });

    const uni1 = arg1.unidad ? arg1.unidad : '';
    const uni2 = arg2.unidad ? arg2.unidad : '';

    cx.fillStyle = labelColor;
    cx.font = BOLD;
    cx.fillText(`${arg1.label}:`, x, y);
    cx.fillStyle = contentColor;
    cx.font = NORMAL;
    cx.fillText(`${val1} ${uni1}`, x, y + 30);
    if (arg1.optionalLine) {
      cx.fillText(`${arg1.optionalLine}`, x, y + 60);
    }

    cx.fillStyle = labelColor;
    cx.font = BOLD;
    cx.fillText(`${arg2.label}:`, x + 160, y);
    cx.fillStyle = contentColor;
    cx.font = NORMAL;
    cx.fillText(`${val2} ${uni2}`, x + 160, y + 30);
    if (arg2.optionalLine) {
      cx.fillText(`${arg2.optionalLine}`, x + 160, y + 60);
    }
  }

  calculate() {
    if (this.tab === 'fromkg') {
      this.workConfigService.calculateMetrosLineales();
    } else if (this.tab === 'fromlargo') {
      this.workConfigService.calculateKgTotales();
    }
    this.drawCanvas();
  }

  async setWorkData() {
    const modal = await this.modalController.create({
      component: ConfigWorkComponent,
      componentProps: {
        data: this.CurrentWork,
      },
    });

    modal.onWillDismiss().then(v => {
      if (v.role === 'update') {
        this.calculate();
      }
    });

    return await modal.present();
  }

  share() {
    // ctx.save();
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.workConfigService.shareCanvas(canvasEl);
  }
  change(ev: any) {
    console.log(this.tab);
  }

  // share() {
  //   // this.workConfigService.shareResults(this.CurrentWork, this.currentTab === 'tab-kgml' ? resultData.Cantidad : resultData.Metros, this.currentTab === 'tab-kgml' ? resultData.Metros : resultData.Cantidad, [
  //   //   resultData.mt2Totales,
  //   //   resultData.Tiempo,
  //   //   resultData.KgHora,
  //   // ]);
  // }

  // change(ev: any) {
  //   console.log(this.tab);
  // }
}
