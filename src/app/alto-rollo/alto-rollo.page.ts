import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IWorkConfig, WorkConfigService } from '../work-config.service';
import { Subscription } from 'rxjs';
import { Tabs, ModalController } from '@ionic/angular';
import { ConfigWorkComponent } from '../modals/config-work/config-work.component';

@Component({
  selector: 'app-alto-rollo',
  templateUrl: './alto-rollo.page.html',
  styleUrls: ['./alto-rollo.page.scss'],
})
export class AltoRolloPage implements OnInit, OnDestroy {
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

  calculate() {
    if (this.currentTab === 'tab-kgml') {
      this.workConfigService.calculateMetrosLineales();
    } else if (this.currentTab === 'tab-mlkg') {
      this.workConfigService.calculateKgTotales();
    }
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
  async changeTab(e: Tabs) {
    const tb = await e.getSelected();
    this.currentTab = tb !== undefined ? tb.tab : '';
  }

  share() {}
}
