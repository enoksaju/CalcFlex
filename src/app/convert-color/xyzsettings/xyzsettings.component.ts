import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IConverters, IColorSpace } from '../../color-library/color-space';

@Component({
  selector: 'app-xyzsettings',
  templateUrl: './xyzsettings.component.html',
  styleUrls: ['./xyzsettings.component.scss']
})
export class XyzsettingsComponent implements OnInit {
  @Input() converters: IConverters;
  @Output() colorChange = new EventEmitter<IColorSpace>();
  change() {
    this.colorChange.emit(this.converters.rgb);
  }
  constructor() { }

  ngOnInit() {
  }

}
