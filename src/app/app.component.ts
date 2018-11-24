import { Component } from '@angular/core';

import { Platform, IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { MaterialesService } from './Materiales.service';
import { WorkConfigService } from './work-config.service';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home',
    },
    {
      title: 'Metros Lineales',
      url: '/ml',
      srcIcon: 'assets/icons/ruler.svg',
    },
    {
      title: 'Alto de Rollo',
      url: '/altoRollo',
      srcIcon: 'assets/icons/toilet-paper.svg',
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite,
    private materialesService: MaterialesService,
    private workConfigService: WorkConfigService,
    private androidFullScreen: AndroidFullScreen,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log(this.platform.platforms());

    this.platform.ready().then(() => {
      this.androidFullScreen
        .isImmersiveModeSupported()
        .then(() => {
          console.log('Immersive mode supported');
          this.androidFullScreen.immersiveMode().then(() => {
            console.log('set immersiveMode success');
          });
        })
        .catch(err => console.log(err));

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
