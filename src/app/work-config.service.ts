import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IMaterial } from './Materiales.service';
import { BehaviorSubject } from 'rxjs';
import { promise } from 'protractor';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as html2canvas from 'html2canvas';
import { Platform } from '@ionic/angular';

export interface IWorkConfig {
  Material?: IMaterial;
  Calibre?: number;
  Ancho?: number;
  Tinta?: number;
  Velocidad?: number;
  Cantidad?: number;
  CantidadRollo?: number;
  Metros?: number;
  AltoRollo?: number;
  Gramaje?: number;
  mt2Kg?: number;
  mt2Totales?: number;
  Tiempo?: number;
  KgHora?: number;
  Centro: number;
}

export enum resultData {
  Densidad,
  Material,
  Calibre,
  Ancho,
  Tinta,
  Velocidad,
  Cantidad,
  CantidadRollo,
  Metros,
  AltoRollo,
  Gramaje,
  mt2Kg,
  mt2Totales,
  Tiempo,
  KgHora,
  Centro,
}

export const EMPTY_WORK_CONFIG: IWorkConfig = {
  Material: { Nombre: 'Sin Especificar', Densidad: 0, Abreviatura: '' },
  Calibre: 0,
  Ancho: 0,
  Tinta: 0,
  Velocidad: 0,
  Cantidad: 0,
  CantidadRollo: 0,
  Metros: 0,
  AltoRollo: 0,
  Gramaje: 0,
  mt2Kg: 0,
  mt2Totales: 0,
  Tiempo: 0,
  KgHora: 0,
  Centro: 6,
};

export interface IDataCalc {
  value: string;
  name: string;
  unit: string;
}

let ccf: IWorkConfig;

@Injectable({
  providedIn: 'root',
})
export class WorkConfigService {
  private WorkConfigS: BehaviorSubject<IWorkConfig> = new BehaviorSubject<IWorkConfig>(EMPTY_WORK_CONFIG);
  constructor(private storage: Storage, private socialSharing: SocialSharing, private platform: Platform) {}

  updateWork(work: IWorkConfig) {
    this.storage.set('currentWork', work).then(val => {
      this.reloadWork();
    });
  }

  reloadWork() {
    ccf = EMPTY_WORK_CONFIG;
    this.storage
      .get('currentWork')
      .then(val => {
        if (val === null) {
          this.WorkConfigS.next(EMPTY_WORK_CONFIG);
        } else {
          ccf = val;
          this.WorkConfigS.next(val);
        }
      })
      .catch(err => {
        console.log(err);
        this.WorkConfigS.next(EMPTY_WORK_CONFIG);
      });
  }

  WorkConfig() {
    return this.WorkConfigS.asObservable();
  }

  calculateMetrosLineales() {
    ccf.Ancho = ccf.Ancho === null ? 0 : ccf.Ancho;
    ccf.Calibre = ccf.Calibre === null ? 0 : ccf.Calibre;
    ccf.Tinta = ccf.Tinta == null ? 0 : ccf.Tinta;

    try {
      ccf.Gramaje = ccf.Calibre * ccf.Material.Densidad + ccf.Tinta;
      ccf.mt2Kg = 1000 / ccf.Gramaje;
      ccf.mt2Totales = ccf.mt2Kg * ccf.Cantidad;
      ccf.Metros = Number.parseFloat(((ccf.Cantidad * 100000) / (ccf.Gramaje * ccf.Ancho)).toFixed(0));
      ccf.Tiempo = ccf.Metros / ccf.Velocidad;
      ccf.KgHora = (ccf.Cantidad / ccf.Tiempo) * 60;
    } catch (error) {
      console.log(error);
      ccf.Gramaje = 0;
      ccf.mt2Kg = 0;
      ccf.mt2Totales = 0;
      ccf.Metros = 0;
      ccf.Tiempo = 0;
      ccf.KgHora = 0;
    } finally {
      this.updateWork(ccf);
    }
  }

  calculateKgTotales() {
    ccf.Ancho = ccf.Ancho === null ? 0 : ccf.Ancho;
    ccf.Calibre = ccf.Calibre === null ? 0 : ccf.Calibre;
    ccf.Tinta = ccf.Tinta == null ? 0 : ccf.Tinta;
    try {
      ccf.Gramaje = ccf.Calibre * ccf.Material.Densidad + ccf.Tinta;
      ccf.mt2Kg = 1000 / ccf.Gramaje;
      ccf.Cantidad = Number.parseFloat(((ccf.Metros * ccf.Gramaje * ccf.Ancho) / 100000).toFixed(3));
      ccf.mt2Totales = ccf.mt2Kg * ccf.Cantidad;
      ccf.Tiempo = ccf.Metros / ccf.Velocidad;
      ccf.KgHora = (ccf.Cantidad / ccf.Tiempo) * 60;
    } catch (error) {
      ccf.Gramaje = 0;
      ccf.mt2Kg = 0;
      ccf.mt2Totales = 0;
      ccf.Cantidad = 0;
      ccf.Tiempo = 0;
      ccf.KgHora = 0;
    } finally {
      this.updateWork(ccf);
    }
  }

  private buildIDataCalc(data: resultData, CurrentWork: IWorkConfig) {
    switch (data) {
      case resultData.Densidad:
        return {
          name: 'Densidad',
          unit: '<sup>g</sup>/<sub>cm<sup>3</sup></sub>',
          value: CurrentWork.Material.Densidad.toFixed(3),
        };
      case resultData.Material:
        return {
          name: 'Material',
          unit: CurrentWork.Material.Abreviatura,
          value: CurrentWork.Material.Nombre,
        };
      case resultData.Cantidad:
        return {
          name: 'Cantidad',
          unit: 'Kg',
          value: CurrentWork.Cantidad.toFixed(2),
        };
      case resultData.CantidadRollo:
        return {
          name: '<sup>Kg</sup>/<sub>Rollo</sub>',
          unit: 'Kg',
          value: CurrentWork.CantidadRollo.toFixed(2),
        };
      case resultData.Gramaje:
        return {
          name: 'Gramaje',
          unit: '<sup>g</sup>/<sub>cm<sup>2</sup></sub>',
          value: CurrentWork.Gramaje.toFixed(3),
        };
      case resultData.KgHora:
        return {
          name: '<sup>Kg</sup>/<sub>h</sub>',
          unit: '<sup>Kg</sup>/<sub>h</sub>',
          value: CurrentWork.KgHora.toFixed(2),
        };
      case resultData.Metros:
        return {
          name: 'Longitud',
          unit: 'm',
          value: CurrentWork.Metros.toFixed(0),
        };
      case resultData.Tiempo:
        return {
          name: 'Tiempo',
          unit: 'min',
          value: CurrentWork.Tiempo.toFixed(2),
        };
      case resultData.Tinta:
        return {
          name: 'Tinta',
          unit: '<sup>g</sup>/<sub>m<sup>2</sup></sub>',
          value: CurrentWork.Tinta.toFixed(2),
        };
      case resultData.Velocidad:
        return {
          name: 'Velocidad',
          unit: '<sup>m</sup>/<sub>min</sub>',
          value: CurrentWork.Velocidad.toFixed(2),
        };
      case resultData.mt2Kg:
        return {
          name: '<sup>m<sup>2</sup></sup>/<sub>Kg</sub>',
          unit: '<sup>m<sup>2</sup></sup>',
          value: CurrentWork.mt2Kg.toFixed(2),
        };
      case resultData.mt2Totales:
        return {
          name: 'Metros<sup>2</sup>',
          unit: 'm<sup>2</sup>',
          value: CurrentWork.mt2Totales.toFixed(2),
        };
      case resultData.AltoRollo:
        return {
          name: 'Alto Rollo',
          unit: 'mm',
          value: CurrentWork.AltoRollo.toFixed(1),
        };
      case resultData.Ancho:
        return {
          name: 'Ancho',
          unit: 'cm',
          value: CurrentWork.Ancho.toFixed(2),
        };
      case resultData.Calibre:
        return {
          name: 'Calibre',
          unit: '<span>&#181;</span>m',
          value: CurrentWork.Calibre.toFixed(1),
        };
      case resultData.Centro:
        return {
          name: 'Centro',
          unit: 'in',
          value: CurrentWork.Centro.toFixed(0),
        };
    }
  }

  private buildStringDataCalc(dt: IDataCalc, includeDivider: boolean = false) {
    return (
      `
  <div class="row" style="margin-bottom: 2px;">
    <label class="col s3 indigo-text left right-align m-label" style="padding-right: 2px; font-size: 14px;">${dt.name}:</label>
    <p class="col s6 blue-text text-darken-1 right-align" style="padding-left: 2px; padding-right: 2px; font-size: 16px;">${dt.value}</p>
    <p class="col s3 blue-text right text-darken-1" style="padding-left: 2px;">${dt.unit}</p>
  </div>
  ` + (includeDivider ? '<div class="divider"></div>' : '')
    );
  }

  shareResults(CurrentWork: IWorkConfig, inputVariable: resultData, outputVariable: resultData, extraData: resultData[] = []) {
    let render = ` 
    <div class="row" style="margin-bottom: 0px;">
      <div class="col s12">
        <div class="card blue z-depth-3" style="padding: 5px;"><h5 class="center-align white-text">Flex-Calc</h5></div>
      </div>
    </div>
    <div class="row" style="margin-bottom: 0px;">
      <div class="col s12 ">
        <div class="card z-depth-1 grey lighten-4">
          <div class="card-content" style="padding: 10px;">
            <span class="card-title blue-text text-darken-2"><i class="fas fa-cog blue-grey-text"></i> Configuracion:</span>
            <div class="row" style="margin-bottom: 2px;">
              <label class="col s3 indigo-text left right-align m-label" style="padding-right: 2px;">Material:</label>
              <p class="col s9 grey-text text-darken-1" style="padding-left: 2px;">
              ${CurrentWork.Material.Nombre}
              </p>
            </div>
            <div class="row" style="margin-bottom: 2px;">
              <label class="col s3 indigo-text left right-align m-label" style="padding-right: 2px;">Densidad:</label>
              <p class="col s3 left-align grey-text text-darken-1" style="padding-left: 2px;">
              ${CurrentWork.Material.Densidad.toFixed(3)} <sup>g</sup>/<sub>cm<sup>3</sup></sub>
              </p>
              <label class="col s3 indigo-text left right-align m-label" style="padding-right: 2px;">Calibre:</label>
              <p class="col s3 left-align grey-text text-darken-1" style="padding-left: 2px;">${CurrentWork.Calibre.toFixed(2)} <span>&#181;</span>m</p>
            </div>
            <div class="row" style="margin-bottom: 2px;">
              <label class="col s3 indigo-text left right-align m-label" style="padding-right: 2px;">Ancho:</label>
              <p class="col s3 left-align grey-text text-darken-1" style="padding-left: 2px;">${CurrentWork.Ancho.toFixed(2)} cm</p>
              <label class="col s3 indigo-text left right-align m-label" style="padding-right: 2px;">Tinta:</label>
              <p class="col s3 left-align grey-text text-darken-1" style="padding-left: 2px;">
                ${CurrentWork.Tinta.toFixed(2)} <sup>g</sup>/<sub>cm<sup>2</sup></sub>
              </p>
            </div>
            <div class="row" style="margin-bottom: 2px;">
              <label class="col s3 indigo-text left right-align m-label" style="padding-right: 2px;">Velocidad:</label>
              <p class="col s3 left-align grey-text text-darken-1" style="padding-left: 2px;">${CurrentWork.Velocidad.toFixed(0)} <sup>m</sup>/<sub>min</sub></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row" style="margin-bottom: 0px;">
      <div class="col s12 ">
        <div class="card z-depth-1 grey lighten-4">
          <div class="card-content" style="padding: 10px;">
            <div class="row" style="margin-bottom: 2px;">
              <label class="col s3 indigo-text left right-align m-label" style="padding-right: 2px;">${this.buildIDataCalc(inputVariable, CurrentWork).name}:</label>
              <p class="col s6 blue-text text-darken-1 right-align" style="padding-left: 2px; padding-right: 2px; font-size: 16px;">
              ${this.buildIDataCalc(inputVariable, CurrentWork).value}
              </p>
              <p class="col s3 blue-text right text-darken-1" style="padding-left: 2px;">
              ${this.buildIDataCalc(inputVariable, CurrentWork).unit}              
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col s12">
        <div class="card z-depth-2 grey lighten-4">
          <div class="card-content" style="padding: 10px;">
            <span class="card-title blue-text text-darken-2"><i class="fas fa-clipboard-list blue-grey-text"></i> Resultados:</span>
           `;

    render += this.buildStringDataCalc(this.buildIDataCalc(outputVariable, CurrentWork), true);
    render += this.buildStringDataCalc(this.buildIDataCalc(resultData.Gramaje, CurrentWork), true);

    extraData.forEach(item => {
      render += this.buildStringDataCalc(this.buildIDataCalc(item, CurrentWork), true);
    });

    render += `</div></div></div></div>`;

    const el = document.createElement('div');

    document.body.appendChild(el);
    el.classList.add('container');
    el.style.width = '380px';
    el.style.height = 'auto';
    el.style.position = 'fixed';
    el.style.background = 'white';
    el.style.top = '0';
    el.style.left = '0';
    el.style.zIndex = '-99999999';
    el.innerHTML = render;

    html2canvas(el).then(cv => {
      if (window.cordova) {
        this.socialSharing.share(null, null, cv.toDataURL());
      } else {
        const image = new Image();
        image.src = cv.toDataURL();
        const w = window.open('');
        w.document.write(image.outerHTML);
      }

      el.remove();
    });
  }
}
