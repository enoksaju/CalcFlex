import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-cmyksettings',
  templateUrl: './cmyksettings.component.html',
  styleUrls: ['./cmyksettings.component.scss']
})
export class CmyksettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  change() {
    this.colorChange.emit(this.converters.rgb);
  }
  constructor() { }

  ngOnInit() {
  }

}
