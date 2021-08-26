import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { SettingsService } from './settings.service';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('typeForm', { static: true })
  typeForm: any;
  type: string;
  typeSettings: Array<any> = [];
  isSubmitted: boolean;

  constructor(
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private settingsService: SettingsService
  ) {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      this.isSubmitted = false;
      this.getTypeSettings();
    });
  }

  ngOnInit() {}

  checkboxChange(model: any, value: string) {
    if (model.selected) {
      const currentIndex: number = model.selected.indexOf(value);
      if (currentIndex > -1) {
        model.selected.splice(currentIndex, 1);
      } else {
        model.selected.push(value);
      }
    } else {
      model.selected = [value];
    }
  }

  updateSetting() {
    this.isSubmitted = true;

    if (this.typeForm.valid) {
      const body = { setting: {} };

      this.typeSettings.forEach(setting => {
        switch (setting.displayType) {
          case 'text':
          case 'textarea':
            body.setting[setting.name] = setting.value;
            break;
          case 'select':
          case 'multiselect':
          case 'radio':
          case 'checkbox':
            body.setting[setting.name] =
              setting.selected && setting.selected.length
                ? setting.selected.join(',')
                : '';
            break;
          default:
            break;
        }
      });

      this.settingsService.updateTypeSetting(body).subscribe(
        (res: any) => {
          if (res && res.success) {
            this.toastrService.success(res.message);
            this.isSubmitted = false;
          } else {
            this.toastrService.error(res.message);
          }
        },
        err => {
          this.toastrService.error(err.message);
        }
      );
    }
  }

  private getTypeSettings() {
    this.settingsService.getByType(this.type).subscribe(
      (res: any) => {
        if (res && res.success) {
          this.typeSettings = res.data;
          this.typeSettings.forEach(setting => {
            if (
              ['select', 'multiselect', 'radio', 'checkbox'].indexOf(
                setting.displayType
              ) > -1
            ) {
              setting.selected = setting.value.split(',');
            }

            if (['select', 'multiselect'].indexOf(setting.displayType) > -1) {
              setting.sourceValues = setting.sourceValues.map(
                (sourceValue: any) => {
                  return { id: sourceValue.value, name: sourceValue.name };
                }
              );
            }
          });
        }
      },
      err => {}
    );
  }
}
