import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IMaterial } from './Materiales.service';
import { BehaviorSubject } from 'rxjs';
import { promise } from 'protractor';

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
};

let ccf: IWorkConfig;

@Injectable({
  providedIn: 'root',
})
export class WorkConfigService {
  private WorkConfigS: BehaviorSubject<IWorkConfig> = new BehaviorSubject<IWorkConfig>(EMPTY_WORK_CONFIG);
  constructor(private storage: Storage) {}

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
}
