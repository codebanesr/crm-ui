import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-form-preview',
  templateUrl: './dynamic-form-preview.component.html',
  styleUrls: ['./dynamic-form-preview.component.scss'],
})
export class DynamicFormPreviewComponent implements OnInit {

  @Input() formModel = {
    name: '',
    description: '',
    attributes: []
  };

  constructor() { }

  ngOnInit() {}

}
