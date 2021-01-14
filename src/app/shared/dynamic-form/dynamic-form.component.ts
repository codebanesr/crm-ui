import { copyArrayItem, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { DndDropEvent, DropEffect } from 'ngx-drag-drop';
import { ModelInterface } from 'src/app/home/interfaces/global.interfaces';
import { value, field } from 'src/global.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  @Input() formModel: any;
  @Output() formUpdate = new EventEmitter<ModelInterface>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formModel.currentValue !== changes.formModel.previousValue) {
      // console.log(changes.formModel.currentValue);
      this.model = changes.formModel.currentValue;
    }
  }

  value: value = {
    label: '',
    value: '',
  };
  success = false;

  // <i  nzType="font-colors" ></i>
  fieldModels: Array<field> = [
    {
      type: 'text',
      icon: 'invert_colors',
      label: 'Text',
      description: 'Enter your name',
      placeholder: 'Enter your name',
      regex: '',
      handle: true,
    },
    {
      type: 'email',
      icon: 'email',
      required: true,
      label: 'Email',
      description: 'Enter your email',
      placeholder: 'Enter your email',
      regex: '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+).([a-zA-Z]{2,5})$',
      errorText: 'Please enter a valid email',
      handle: true,
    },
    {
      type: 'phone',
      icon: 'phone',
      label: 'Phone',
      description: 'Enter your phone',
      placeholder: 'Enter your phone',
      regex: '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$',
      errorText: 'Please enter a valid phone number',
      handle: true,
    },
    {
      type: 'number',
      label: 'Number',
      icon: 'format_list_numbered',
      description: 'Age',
      placeholder: 'Enter your age',
      value: '20',
      min: 12,
      max: 90,
    },
    {
      type: 'date',
      icon: 'calendar_today',
      label: 'Date',
      placeholder: 'Date',
    },
    {
      type: 'datetime-local',
      icon: 'more_time',
      label: 'DateTime',
      placeholder: 'Date Time',
    },
    {
      type: 'textarea',
      icon: 'file_copy',
      label: 'Textarea',
    },
    {
      value: '',
      type: 'paragraph',
      icon: 'line_weight',
      label: 'Paragraph',
      placeholder: 'Type your text to display here only',
    },
    {
      type: 'checkbox',
      required: true,
      label: 'Checkbox',
      icon: 'check_circle_outline',
      description: 'Checkbox',
      inline: true,
      values: [
        {
          label: 'Option 1',
          value: 'option-1',
        },
        {
          label: 'Option 2',
          value: 'option-2',
        },
      ],
    },
    {
      type: 'radio',
      icon: 'radio_button_checked',
      label: 'Radio',
      description: 'Radio boxes',
      values: [
        {
          label: 'Option 1',
          value: 'option-1',
        },
        {
          label: 'Option 2',
          value: 'option-2',
        },
      ],
    },
    {
      type: 'autocomplete',
      icon: 'tab_unselected',
      label: 'Select',
      description: 'Select',
      placeholder: 'Select',
      values: [
        {
          label: 'Option 1',
          value: 'option-1',
        },
        {
          label: 'Option 2',
          value: 'option-2',
        },
        {
          label: 'Option 3',
          value: 'option-3',
        },
      ],
    },
    {
      type: 'file',
      icon: 'cloud_upload',
      label: 'File Upload',
    },
    {
      type: 'button',
      icon: 'done_all',
      label: 'Submit',
    },
  ];

  modelFields: Array<field> = [];
  model: ModelInterface = {
    name: 'App name...',
    description: 'App Description...',
    theme: {
      bgColor: 'ffffff',
      textColor: '555555',
      bannerImage: '',
    },
    attributes: this.modelFields,
  };

  report = false;
  reports: any = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {}

  

  // onDragged(item: any, list: any[], effect: DropEffect) {
  //   if (effect === 'move') {
  //     const index = list.indexOf(item);
  //     list.splice(index, 1);
  //     this.onModelChange();
  //   }
  // }

  // onDrop(event: DndDropEvent, list?: any[]) {
  //   if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
  //     if (event.dropEffect === 'copy')
  //       event.data.name = event.data.type + '-' + new Date().getTime();
  //     let index = event.index;
  //     if (typeof index === 'undefined') {
  //       index = list.length;
  //     }
  //     list.splice(index, 0, event.data);
  //     this.onModelChange();
  //   }
  // }

  addValue(values) {
    values.push(this.value);
    this.value = { label: '', value: '' };
    this.onModelChange();
  }

  removeField(i) {
    this.model.attributes.splice(i, 1);
    this.onModelChange();
  }

  onModelChange() {
    this.formUpdate.emit(this.model);
  }

  updateForm() {
    let input = new FormData();
    input.append('id', this.model._id);
    input.append('name', this.model.name);
    input.append('description', this.model.description);
    input.append('bannerImage', this.model.theme.bannerImage);
    input.append('bgColor', this.model.theme.bgColor);
    input.append('textColor', this.model.theme.textColor);
    input.append('attributes', JSON.stringify(this.model.attributes));
  }

  initReport() {
    this.report = true;
    let input = {
      id: this.model._id,
    };
  }

  toggleValue(item) {
    item.selected = !item.selected;
  }

  submit() {
    let valid = true;
    let validationArray = JSON.parse(JSON.stringify(this.model.attributes));
    validationArray.reverse().forEach((field) => {
      console.log(field.label + '=>' + field.required + '=>' + field.value);
      if (field.required && !field.value && field.type != 'checkbox') {
        valid = false;
        return false;
      }
      if (field.required && field.regex) {
        let regex = new RegExp(field.regex);
        if (regex.test(field.value) == false) {
          valid = false;
          return false;
        }
      }
      if (field.required && field.type == 'checkbox') {
        if (field.values.filter((r) => r.selected).length == 0) {
          // swal("Error", "Please enterrr " + field.label, "error");
          valid = false;
          return false;
        }
      }
    });
    if (!valid) {
      return false;
    }
    console.log('Save', this.model);
    let input = new FormData();
    input.append('formId', this.model._id);
    input.append('attributes', JSON.stringify(this.model.attributes));
  }

  showModel() {
    console.log(this.model);
  }

  drop(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
        const clone = cloneDeep(event.previousContainer.data[event.previousIndex]);

        // Add the clone to the new array.
        event.container.data.splice(event.currentIndex, 0, clone);
        this.onModelChange();
    }
  }
}
