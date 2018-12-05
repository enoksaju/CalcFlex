import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-cmysettings',
  templateUrl: './cmysettings.component.html',
  styleUrls: ['./cmysettings.component.scss']
})
export class CmysettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  change() {
    this.colorChange.emit(this.converters.rgb);
  }
  constructor() { }

  ngOnInit() {
  }

}
