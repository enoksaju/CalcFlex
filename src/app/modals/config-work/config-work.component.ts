import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, Input, NavParams } from '@ionic/angular';
import { IWorkConfig, WorkConfigService } from '../../work-config.service';
import { Subscription } from 'rxjs';
import { MaterialesService, IMaterial } from '../../Materiales.service';

@Component({
  selector: 'app-config-work',
  templateUrl: './config-work.component.html',
  styleUrls: ['./config-work.component.scss'],
})
export class ConfigWorkComponent implements OnInit, OnDestroy {
  workConfig: IWorkConfig;
  $workConfig: Subscription;
  Materiales: IMaterial[];
  $Materiales: Subscription;
  constructor(public modalController: ModalController, private navParams: NavParams, private workConfigService: WorkConfigService, private materialesService: MaterialesService) {
    this.$Materiales = this.materialesService.Materiales().subscribe(u => (this.Materiales = u));
  }

  ngOnInit() {
    // this.workConfig = this.navParams.get('data');
    
    this.$workConfig = this.workConfigService.WorkConfig().subscribe(u => (this.workConfig = u));   
  }
  ngOnDestroy() {
    this.$workConfig.unsubscribe();
    this.$Materiales.unsubscribe();
  }
  closeAndSave() {
    this.workConfigService.updateWork(this.workConfig);
    this.modalController.dismiss(null, 'update');
  }
  close() {
    this.workConfigService.reloadWork();
    this.modalController.dismiss(null, 'cancel');
  }
}
