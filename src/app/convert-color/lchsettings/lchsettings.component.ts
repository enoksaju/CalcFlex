import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-lchsettings',
  templateUrl: './lchsettings.component.html',
  styleUrls: ['./lchsettings.component.scss']
})
export class LchsettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  change() {
    this.colorChange.emit(this.converters.rgb);
  }
  constructor() { }

  ngOnInit() {
  }

}
