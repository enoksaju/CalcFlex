import { Component, OnInit, Input } from '@angular/core';
import { IPantone } from '../../pantone.service';

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.scss'],
})
export class TargetComponent implements OnInit {
  @Input() Pantone: IPantone;
  constructor() {}

  ngOnInit() {}
}
