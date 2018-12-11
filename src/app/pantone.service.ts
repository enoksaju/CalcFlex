import { Injectable } from '@angular/core';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs';
import { Platform, NumericValueAccessor } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as chroma from 'chroma-js';

const tryCols: IPantone[] = [
  {
    Id: 1,
    a: -7.56,
    b: 65.76,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 92.04,
    m: 0,
    name: '100 C',
    page: 0,
    rgb: -595103,
    row: 0,
    y: 56
  },
  {
    Id: 2,
    a: -7.51,
    b: 75.11,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 91.76,
    m: 0,
    name: '101 C',
    page: 0,
    rgb: -529848,
    row: 1,
    y: 68
  },
  {
    Id: 3,
    a: -4.87,
    b: 106.29,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 90.23,
    m: 0,
    name: '102 C',
    page: 0,
    rgb: -204032,
    row: 2,
    y: 95
  },
  {
    Id: 4,
    a: -1.31,
    b: 110.87,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 88.98,
    m: 1,
    name: 'Yellow C',
    page: 0,
    rgb: -74496,
    row: 3,
    y: 100
  },
  {
    Id: 5,
    a: 0.45,
    b: 83.73,
    c: 5,
    fd_id: 1,
    k: 16,
    l: 70.15,
    m: 5,
    name: '103 C',
    page: 0,
    rgb: -3823360,
    row: 4,
    y: 100
  },
  {
    Id: 6,
    a: -0.3,
    b: 70.66,
    c: 7,
    fd_id: 1,
    k: 28,
    l: 63.55,
    m: 13,
    name: '104 C',
    page: 0,
    rgb: -5269504,
    row: 5,
    y: 100
  },
  {
    Id: 7,
    a: -0.75,
    b: 45.49,
    c: 13,
    fd_id: 1,
    k: 45,
    l: 51.58,
    m: 18,
    name: '105 C',
    page: 0,
    rgb: -7767513,
    row: 6,
    y: 88
  },
  {
    Id: 8,
    a: 1.55,
    b: 32.19,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 90.2,
    m: 4,
    name: '7401 C',
    page: 1,
    rgb: -663132,
    row: 0,
    y: 27
  },
  {
    Id: 9,
    a: 1.42,
    b: 34.3,
    c: 1,
    fd_id: 1,
    k: 1,
    l: 87.03,
    m: 4,
    name: '7402 C',
    page: 1,
    rgb: -1255272,
    row: 1,
    y: 45
  },
  {
    Id: 10,
    a: 2.78,
    b: 43.03,
    c: 1,
    fd_id: 1,
    k: 2,
    l: 85.9,
    m: 11,
    name: '7403 C',
    page: 1,
    rgb: -1125244,
    row: 2,
    y: 58
  },
  {
    Id: 11,
    a: -0.92,
    b: 73.84,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 87.53,
    m: 8,
    name: '7404 C',
    page: 1,
    rgb: -730560,
    row: 3,
    y: 86
  },
  {
    Id: 12,
    a: 2.33,
    b: 89.62,
    c: 0,
    fd_id: 1,
    k: 2,
    l: 83.84,
    m: 11,
    name: '7405 C',
    page: 1,
    rgb: -865024,
    row: 4,
    y: 97
  },
  {
    Id: 13,
    a: 6.8,
    b: 88.59,
    c: 0,
    fd_id: 1,
    k: 2,
    l: 81.45,
    m: 20,
    name: '7406 C',
    page: 1,
    rgb: -932864,
    row: 5,
    y: 100
  },
  {
    Id: 14,
    a: 11.13,
    b: 46.48,
    c: 6,
    fd_id: 1,
    k: 12,
    l: 68.94,
    m: 36,
    name: '7407 C',
    page: 1,
    rgb: -3432366,
    row: 6,
    y: 79
  },
  {
    Id: 15,
    a: -4.13,
    b: 74.7,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 90.66,
    m: 0,
    name: '106 C',
    page: 2,
    rgb: -400057,
    row: 0,
    y: 75
  },
  {
    Id: 16,
    a: -2.48,
    b: 84.13,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 89.83,
    m: 0,
    name: '107 C',
    page: 2,
    rgb: -270046,
    row: 1,
    y: 92
  },
  {
    Id: 17,
    a: 0.62,
    b: 94.51,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 88.44,
    m: 5,
    name: '108 C',
    page: 2,
    rgb: -75008,
    row: 2,
    y: 98
  },
  {
    Id: 18,
    a: 5.99,
    b: 98.55,
    c: 0,
    fd_id: 1,
    k: 0,
    l: 86.28,
    m: 9,
    name: '109 C',
    page: 2,
    rgb: -12032,
    row: 3,
    y: 100
  },
  {
    Id: 19,
    a: 9.31,
    b: 88.89,
    c: 2,
    fd_id: 1,
    k: 8,
    l: 72.59,
    m: 22,
    name: '110 C',
    page: 2,
    rgb: -2446848,
    row: 4,
    y: 100
  },
  {
    Id: 20,
    a: 4.68,
    b: 68.12,
    c: 8,
    fd_id: 1,
    k: 28,
    l: 59.3,
    m: 21,
    name: '111 C',
    page: 2,
    rgb: -5600768,
    row: 5,
    y: 100
  },
  {
    Id: 21,
    a: 2.48,
    b: 57.2,
    c: 10,
    fd_id: 1,
    k: 40,
    l: 56.17,
    m: 20,
    name: '112 C',
    page: 2,
    rgb: -6519790,
    row: 6,
    y: 100
  }
];
export interface IPantone {
  Id?: number;
  fd_id?: number;
  page?: number;
  row?: number;
  name?: string;
  l?: number;
  a?: number;
  b?: number;
  rgb?: number;
  c?: number;
  m?: number;
  y?: number;
  k?: number;
  hex?: string;
  rgbValues?: { r: number; g: number; b: number };
}

@Injectable({
  providedIn: 'root'
})
export class PantoneService {
  database: SQLiteObject = null;
  private databaseReady: BehaviorSubject<boolean>;
  private pantoneColors_: BehaviorSubject<IPantone[]>;

  constructor(
    public sqlitePorter: SQLitePorter,
    private storage: Storage,
    private sqlite: SQLite,
    private platform: Platform,
    private http: HttpClient
  ) {
    this.databaseReady = new BehaviorSubject(false);

    tryCols.forEach(cc => {
      cc.rgbValues = this.numberToRgb(cc.rgb);
      cc.hex = chroma.rgb(cc.rgbValues.r, cc.rgbValues.g, cc.rgbValues.b).hex();
    });

    this.pantoneColors_ = new BehaviorSubject(tryCols);
  }

  numberToRgb(num: number): { r: number; g: number; b: number } {
    const r = (num & 0xff0000) >> 16;
    const g = (num & 0x00ff00) >> 8;
    const b = num & 0x0000ff;
    return { r: r, g: g, b: b };
  }

  async setDB(db: SQLiteObject) {
    if (this.database === null) {
      console.log('the databse are null, setting new database');
      this.database = db;
    }
    await this.fillDatabase();
    this.databaseReady.next(true);
    
    // return this.storage.get('database_filled').then(val => {
    //   if (val) {
    //     console.log('the Pantone database are filled');
    //     this.databaseReady.next(true);
    //   } else {
    //     console.log('filling Pantone Database');
    //     this.fillDatabase();
    //   }
    // });
  }

  fillDatabase() {
    return this.http
      .get('assets/data/pantoneCatalogCU.sql', { responseType: 'text' })
      .toPromise()
      .then(dt => {
        this.sqlitePorter.importSqlToDb(this.database, dt).then(data => {
          this.databaseReady.next(true);
          this.storage.set('database_filled', true);
        });
      });
  }

  pantoneColors() {
    return this.pantoneColors_.asObservable();
  }

  updatePantoneColors(fd_id: number) {
    console.log('updateing Pantones');
    return this.database
      .executeSql('select * from color where fd_id = ? order by Id', [fd_id])
      .then(data => {
        const colors: IPantone[] = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            const dt = data.rows.item(i);
            const rgbValues = this.numberToRgb(dt.rgb);
            const hex = chroma.rgb(rgbValues.r, rgbValues.g, rgbValues.b).hex();
            colors.push({
              Id: dt.Id,
              page: dt.page,
              row: dt.row,
              name: dt.name,
              l: dt.l,
              a: dt.a,
              b: dt.b,
              rgb: dt.rgb,
              c: dt.c,
              m: dt.m,
              y: dt.y,
              k: dt.k,
              hex: hex,
              rgbValues: rgbValues
            });
          }
        }
        this.pantoneColors_.next(colors);
      })
      .catch(e => {
        console.error(e);
        this.pantoneColors_.next(tryCols);
      });
  }

  async createDB() {
    await this.setDB(await this.sqlite.create({ name: 'Pantone.db', location: 'default' }));
    await this.updatePantoneColors(1);
    console.log('the Pantone colors was read');
  }

  getFds() {
    return this.database.executeSql('select id, name from fb', []).then(data => {
      const fb: { id: number; name: string }[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          fb.push({ id: data.rows.item(i).id, name: data.rows.item(i).name });
        }
      }
      return fb;
    });
  }
}
