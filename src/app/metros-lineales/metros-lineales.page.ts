import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, Tabs } from '@ionic/angular';
import { ConfigWorkComponent } from '../modals/config-work/config-work.component';
import { WorkConfigService, IWorkConfig } from '../work-config.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-metros-lineales',
  templateUrl: './metros-lineales.page.html',
  styleUrls: ['./metros-lineales.page.scss'],
})
export class MetrosLinealesPage implements OnInit, OnDestroy {
  CurrentWork: IWorkConfig;
  $CurrentWork: Subscription;
  private currentTab: string;

  constructor(public modalController: ModalController, public workConfigService: WorkConfigService) {}

  ngOnInit() {
    this.$CurrentWork = this.workConfigService.WorkConfig().subscribe(u => (this.CurrentWork = u));
  }
  ngOnDestroy() {
    this.$CurrentWork.unsubscribe();
  }

  async setWorkData() {
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
}
