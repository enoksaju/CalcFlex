import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfigWorkComponent } from './modals/config-work/config-work.component';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { FilterPipePantone } from './filterPantone.pipe';

@NgModule({
  declarations: [AppComponent, ConfigWorkComponent],
  entryComponents: [ConfigWorkComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, FlexLayoutModule, IonicModule.forRoot(), IonicStorageModule.forRoot(), AppRoutingModule],
  providers: [StatusBar, SplashScreen, SQLite, SocialSharing, AndroidFullScreen, SQLitePorter, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
