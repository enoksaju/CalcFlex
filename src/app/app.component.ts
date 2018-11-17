import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { MaterialesService } from './Materiales.service';
import { WorkConfigService } from './work-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Metros Lineales',
      url: '/ml',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite,
    private materialesService: MaterialesService,
    private workConfigService: WorkConfigService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide(); // .styleLightContent(); // .styleDefault();
      // this.splashScreen.hide();
      this.createDB();
    });
    this.workConfigService.reloadWork();
  }

  private async createDB() {
    this.sqlite
      .create({ name: 'Calculadora.db', location: 'default' })
      .then(db => {
        return this.materialesService.setDB(db);
      })
      .then(() => {
        this.splashScreen.hide();
      })
      .catch(error => {
        console.error(error);
      });
  }
}
