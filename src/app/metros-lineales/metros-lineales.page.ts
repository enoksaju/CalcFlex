import { Component, OnInit, OnDestroy, SecurityContext, ViewChild } from '@angular/core';
import { ModalController, Tabs, Tab } from '@ionic/angular';
import { ConfigWorkComponent } from '../modals/config-work/config-work.component';
import { WorkConfigService, IWorkConfig, resultData } from '../work-config.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-metros-lineales',
  templateUrl: './metros-lineales.page.html',
  styleUrls: ['./metros-lineales.page.scss'],
})
export class MetrosLinealesPage implements OnInit, OnDestroy {
  @ViewChild('tabs_ml') tabs: Tabs;

  CurrentWork: IWorkConfig;
  $CurrentWork: Subscription;
  dataIMG = '';
  private currentTab: string;

  constructor(public modalController: ModalController, public workConfigService: WorkConfigService) {}

  ngOnInit() {
    this.$CurrentWork = this.workConfigService.WorkConfig().subscribe(u => (this.CurrentWork = u));
    this.tabs.select('tab-kgml');
  }
  ngOnDestroy() {
    this.$CurrentWork.unsubscribe();
  }

  async setWorkData() {
    console.log('openingWokdata');

    const modal = await this.modalController.create({
      component: ConfigWorkComponent,
      componentProps: {
        data: this.CurrentWork,
      },
    });

    modal.onWillDismiss().then(v => {
      if (v.role === 'update' && this.currentTab === 'tab-kgml') {
        this.workConfigService.calculateMetrosLineales();
      } else if (v.role === 'update' && this.currentTab === 'tab-mlkg') {
        this.workConfigService.calculateKgTotales();
      }
    });
    console.log('openingWokdata...');

    return await modal.present();
  }

  calculate() {
    if (this.currentTab === 'tab-kgml') {
      this.workConfigService.calculateMetrosLineales();
    } else if (this.currentTab === 'tab-mlkg') {
      this.workConfigService.calculateKgTotales();
    }
  }

  async changeTab(e: Tabs) {
    const tb = await e.getSelected();
    this.currentTab = tb !== undefined ? tb.tab : '';
  }

  share() {
    this.workConfigService.shareResults(this.CurrentWork, this.currentTab === 'tab-kgml' ? resultData.Cantidad : resultData.Metros, this.currentTab === 'tab-kgml' ? resultData.Metros : resultData.Cantidad, [
      resultData.mt2Totales,
      resultData.Tiempo,
      resultData.KgHora,
    ]);
  }
}
