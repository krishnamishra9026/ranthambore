import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EmailService {
  constructor(private http: HttpClient) {}

  getEmailList(filterObj) {
    return this.http.post('/system-emails/list', filterObj);
  }

  getEmailDetails(emailId) {
    return this.http.get('/system-emails/' + emailId);
  }

  updatePage(emailId, data) {
    return this.http.put('/system-emails/' + emailId, data);
  }
}
