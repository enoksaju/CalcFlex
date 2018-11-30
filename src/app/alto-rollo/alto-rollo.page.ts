import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { IWorkConfig, WorkConfigService } from '../work-config.service';
import { Subscription } from 'rxjs';
import { Tabs, ModalController } from '@ionic/angular';
import { ConfigWorkComponent } from '../modals/config-work/config-work.component';

@Component({
  selector: 'app-alto-rollo',
  templateUrl: './alto-rollo.page.html',
  styleUrls: ['./alto-rollo.page.scss'],
})
export class AltoRolloPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvasAlto') public canvas: ElementRef;
  tab = 'fromkg';
  private cx: CanvasRenderingContext2D;

  CurrentWork: IWorkConfig;
  $CurrentWork: Subscription;

  constructor(public modalController: ModalController, public workConfigService: WorkConfigService) {}
  ngOnInit() {
    this.$CurrentWork = this.workConfigService.WorkConfig().subscribe(u => (this.CurrentWork = u));
    this.drawCanvas();
  }
  ngOnDestroy() {
    this.$CurrentWork.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.drawCanvas();
  }

  drawCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    this.cx.clearRect(0, 0, canvasEl.width, canvasEl.height);

    this.cx.beginPath();
    this.cx.fillStyle = '#fff';
    this.cx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    this.cx.fill();
    this.cx.closePath();

    // Circulo Grande
    this.cx.beginPath();
    this.cx.strokeStyle = 'rgba(52, 73, 94,1)';
    this.cx.fillStyle = 'rgb(214, 219, 223)';
    this.cx.lineWidth = 3;
    this.cx.arc(320, 300, 240, Math.PI / 2, 2.5 * Math.PI);
    this.cx.lineTo(650, 540);
    this.cx.fill();
    this.cx.stroke();
    this.cx.closePath();

    // Core
    this.cx.beginPath();
    this.cx.lineWidth = 30;
    this.cx.fillStyle = '#fff';
    this.cx.strokeStyle = 'rgb(52, 73, 94)';
    this.cx.arc(320, 300, 80, 0, 2 * Math.PI);
    this.cx.fill();
    this.cx.stroke();
    this.cx.closePath();

    // AltoRollo
    this.cx.beginPath();
    this.cx.lineWidth = 4;
    this.cx.font = 'normal 45px Arial';
    this.cx.strokeStyle = 'rgba(46, 204, 113,0.8)';
    this.cx.fillStyle = 'rgba(26, 82, 118,0.8)';

    this.cx.moveTo(400, 250);
    this.cx.lineTo(522, 170);
    this.cx.moveTo(540, 160);
    this.cx.lineTo(600, 120);
    this.cx.lineTo(800, 120);
    this.cx.moveTo(535, 150);
    this.cx.lineTo(550, 170);

    this.cx.moveTo(410, 225);
    this.cx.lineTo(400, 250);
    this.cx.lineTo(425, 253);

    this.cx.moveTo(497, 167);
    this.cx.lineTo(522, 170);
    this.cx.lineTo(513, 197);

    this.cx.fillText(`${this.CurrentWork.AltoRollo.toFixed(1)} mm`, 600, 110);

    // Tamaño Core
    this.cx.moveTo(225, 300);
    this.cx.lineTo(415, 300);

    this.cx.moveTo(250, 285);
    this.cx.lineTo(225, 300);
    this.cx.lineTo(250, 315);

    this.cx.moveTo(390, 285);
    this.cx.lineTo(415, 300);
    this.cx.lineTo(390, 315);

    this.cx.moveTo(305, 290);
    this.cx.lineTo(330, 290);
    this.cx.moveTo(320, 290);
    this.cx.lineTo(150, 90);
    this.cx.lineTo(60, 90);

    this.cx.fillText(`${this.CurrentWork.Centro.toFixed(0)} in`, 55, 80);

    // Largo de Rollo

    this.cx.moveTo(500, 530);
    this.cx.lineTo(550, 490);
    this.cx.lineTo(800, 490);

    this.cx.moveTo(490, 530);
    this.cx.lineTo(515, 530);

    this.cx.fillText(`${this.CurrentWork.LargoRollo.toFixed(0)} m`, 600, 480);

    this.cx.stroke();
    this.cx.closePath();

    // KgRollo

    const KgRollo = `${(this.CurrentWork.CantidadRollo ? this.CurrentWork.CantidadRollo : 0).toFixed(2)} Kg`;

    this.cx.beginPath();
    this.cx.font = 'bold 50px Roboto';
    this.cx.fillStyle = 'rgba(40, 116, 166 ,1)';
    this.cx.fillText(KgRollo, 320 - this.cx.measureText(KgRollo).width / 2, 460);
    this.cx.closePath();

    this.cx.beginPath();
    this.cx.lineWidth = 4;
    this.cx.font = 'bold 30px Roboto';
    this.cx.fillStyle = 'rgba(40, 116, 166 ,1)';
    this.cx.fillText(`(${this.CurrentWork.Material.Abreviatura}) Calibre ${this.CurrentWork.Calibre.toFixed(0)} µm`, 580, 200);

    const textX = 780;
    this.cx.fillStyle = 'rgba(26, 82, 118 ,0.5)';
    this.cx.fillText('Ancho:', textX - 10 - this.cx.measureText('Ancho:').width, 245);
    this.cx.fillText('Tinta:', textX - 10 - this.cx.measureText('Tinta:').width, 280);
    this.cx.fillText('Velocidad:', textX - 10 - this.cx.measureText('Velocidad:').width, 315);
    this.cx.fillText('Tiempo:', textX - 10 - this.cx.measureText('Tiempo:').width, 350);
    this.cx.fillText('Alto Diseño:', textX - 10 - this.cx.measureText('Alto Diseño:').width, 385);
    this.cx.fillText('Piezas:', textX - 10 - this.cx.measureText('Piezas:').width, 420);
 
    this.cx.fillStyle = 'rgba(40, 116, 166 ,1)';
    this.cx.fillText(`${this.CurrentWork.Ancho.toFixed(2)} cm`, textX, 245);
    this.cx.fillText(`${this.CurrentWork.Tinta.toFixed(2)} g/cm²`, textX, 280);
    this.cx.fillText(`${this.CurrentWork.Velocidad.toFixed(0)} m/min`, textX, 315);
    this.cx.fillText(`${(this.CurrentWork.LargoRollo / this.CurrentWork.Velocidad).toFixed(1)} min`, textX, 350);
    this.cx.fillText(`${(this.CurrentWork.AltoDis ? this.CurrentWork.AltoDis : 0).toFixed(2)} cm`, textX, 385);
    this.cx.fillText(`${this.CurrentWork.PiezasRollo.toFixed(0)} pzs`, textX, 420);
    this.cx.closePath();
  }

  calculate() {
    if (this.tab === 'fromkg') {
      this.workConfigService.calculateAltoRollo_fromKg();
    } else if (this.tab === 'fromlargo') {
      this.workConfigService.calculateAltoRollo_fromLargo();
    } else if (this.tab === 'fromalto') {
      this.workConfigService.calculateAltoRollo_fromAlto();
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
    // this.cx.save();
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.workConfigService.shareCanvas(canvasEl);
  }
  change(ev: any) {
    console.log(this.tab);
  }
}
