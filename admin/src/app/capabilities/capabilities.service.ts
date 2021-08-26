import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CapabilitiesService {
  constructor(private http: HttpClient) {}

  getCapabilities(body) {
    return this.http.post('/capabilities/list', body);
  }

  getModules() {
    return this.http.get('/capabilities/modules');
  }

  saveCapabilities(body) {
    return this.http.post('/capabilities', body);
  }

  deleteCapabilities(data) {
    return this.http.post('/capabilities/remove', data);
  }
}
