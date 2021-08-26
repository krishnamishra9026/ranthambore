import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable()
export class SettingsService {
  constructor(private http: HttpClient) {}

  getTypeList(type: string, body) {
    return this.http.post('/settings/list', body);
  }

  getByType(type: string) {
    return this.http.get('/settings/' + type);
  }

  updateTypeSetting(body) {
    return this.http.put('/settings/update', body);
  }
}
