import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PagesService {
  constructor(private http: HttpClient) {}

  getPages(filterObj) {
    return this.http.post('/pages/list', filterObj);
  }
  createPages(adminObj) {
    return this.http.post('/pages/create', adminObj);
  }
  getPageDetails(pageId) {
    return this.http.get('/pages/' + pageId);
  }

  updatePage(data, pageId) {
    return this.http.put('/pages/' + pageId, data);
  }

  deletePage(data) {
    return this.http.post('/pages/change-status', data);
  }
}
