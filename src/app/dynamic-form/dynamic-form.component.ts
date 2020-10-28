import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  constructor() {}

  formModel = [
    {
      type: 'input',
      name: 'firstName',
    },
    {
      type: 'select',
      name: 'options',
      options: ['opt1', 'opt2', 'opt3'],
    },
  ];
  ngOnInit(): void {}
}
