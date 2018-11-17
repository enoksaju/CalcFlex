import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export const insertMaterialStatement =
  'INSERT INTO Materiales(Nombre, Abreviatura, Densidad) VALUES(?,?,?)';

export interface IMaterial {
  Id?: number;
  Nombre?: string;
  Abreviatura?: string;
  Densidad?: number;
}



@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  db: SQLiteObject = null;
  private erDB: Error = new Error(
    'No hay ninguna Base de Datos asignada, use setDB() antes de llamar a cualquier metodo'
  );
  private erId: Error = new Error(
    'El Id del material es incorrecto, no existe en la BD o es nulo'
  );

  private MaterialesS: BehaviorSubject<IMaterial[]> = new BehaviorSubject<
    IMaterial[]
  >([
    {
      Id: 1,
      Nombre: 'Polietileno de Baja Densidad',
      Densidad: 0.925,
      Abreviatura: 'PEBD'
    },
    {
      Id: 1,
      Nombre: 'Polietileno de Alta Densidad',
      Densidad: 0.95,
      Abreviatura: 'PEBD'
    },
    {
      Id: 1,
      Nombre: 'Polipropileno Biorientado',
      Densidad: 0.905,
      Abreviatura: 'BOPP'
    }
  ]);

  constructor(private sqlite: SQLite) {}

  setDB(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
    return this.createTableMateriales();
  }

  createTableMateriales() {
    console.log('Creating BD...');
    return this.db
      .executeSql(
        'CREATE TABLE IF NOT EXISTS Materiales(Id INTEGER PRIMARY KEY, Nombre VARCHAR(250), Abreviatura VARCHAR(20), Densidad DOUBLE)',
        []
      )
      .then(async () => {
        console.log('DB created...');
        const cnt = await this.db.executeSql(
          'SELECT count(*) as count FROM Materiales',
          []
        );
        if (cnt.rows.item(0).count === 0) {
          console.log('inserting first data...');
          this.db
            .sqlBatch([
              [
                insertMaterialStatement,
                ['Polietileno de Baja Densidad', 'PEBD', 0.925]
              ],
              [
                insertMaterialStatement,
                ['Polietileno de Alta Densidad', 'PEBD', 0.95]
              ],
              [
                insertMaterialStatement,
                ['Polipropileno Biorientado', 'BOPP', 0.905]
              ],
              [insertMaterialStatement, ['Polipropileno', 'PP', 0.905]],
              [
                insertMaterialStatement,
                ['Polipropileno Biorientado Perlescente', 'BOPP PER', 0.65]
              ],
              [
                insertMaterialStatement,
                ['Tereftalato de Polietileno', 'PET', 1.38]
              ],
              [
                insertMaterialStatement,
                ['Tereftalato de Polietileno Gicol', 'PET-G', 1.38]
              ],
              [insertMaterialStatement, ['Cloruro de Polivinilo', 'PVC', 1.4]],
              [insertMaterialStatement, ['Papel', 'PAPEL', 1.38]]
            ])
            .then(() => {
              console.log('data inserted...');
            });
        }

        this.refreshMateriales();
      })
      .catch(e => console.log(e));
  }

  refreshMateriales() {
    if (this.db === null) {
      throw this.erDB;
    } else {
      this.db
        .executeSql('SELECT * FROM Materiales', [])
        .then(res => {
          const Materiales_: IMaterial[] = [];
          for (let i = 0; i < res.rows.length; i++) {
            Materiales_.push(res.rows.item(i));
          }
          this.MaterialesS.next(Materiales_);
        })
        .catch(error => {
          console.log(error);
          this.MaterialesS.error(error);
        });
    }
  }

  Materiales() {
    return this.MaterialesS.asObservable();
  }

  AddMaterial(material: IMaterial) {
    if (this.db === null) {
      throw this.erDB;
    } else {
      return this.db
        .executeSql(insertMaterialStatement, [
          material.Nombre,
          material.Abreviatura,
          material.Densidad
        ])
        .then(() => this.refreshMateriales());
    }
  }

  DeleteMaterial(material: IMaterial) {
    if (this.db === null) {
      throw this.erDB;
    } else if (material.Id === null || material.Id <= 0) {
      throw this.erId;
    } else {
      return this.db
        .executeSql('DELETE FROM Materiales WHERE Id = ?', [material.Id])
        .then(() => this.refreshMateriales());
    }
  }

  UpdateMaterial(material: IMaterial) {
    if (this.db === null) {
      throw this.erDB;
    } else if (material.Id === null || material.Id <= 0) {
      throw this.erId;
    } else {
      return this.db
        .executeSql(
          'UPDATE Materiales SET Nombre = ?, Abreviatura = ?, Densidad = ? WHERE Id = ?',
          [
            material.Nombre,
            material.Abreviatura,
            material.Densidad,
            material.Id
          ]
        )
        .then(() => this.refreshMateriales());
    }
  }
}
