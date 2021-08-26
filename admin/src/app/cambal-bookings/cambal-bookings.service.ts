import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CambalBookingsService {

  constructor(private httpService: HttpClient) {}

  getCustomersList(filterObj) {
    return this.httpService.post('/cambal-bookings/list', filterObj);
  }

  getCustomerDetail(customerId) {
    return this.httpService.get('/cambal-bookings/' + customerId);
  }

  generatePdfFile(customerObj) {
    return this.httpService.post('/cambal-bookings/generate-pdf-file' , customerObj);
  }


  sendVoucher(customerObj) {
    return this.httpService.post('/cambal-bookings/send-voucher' , customerObj);
  }


  getPdfFile(customerObj) {
    return this.httpService.post('/cambal-bookings/get-pdf-file' , customerObj);
  }

  createCustomers(categoryObj) {
    return this.httpService.post('/categories/create', categoryObj);
  }

  getParentCustomerList(categoryId) {
    return this.httpService.get('/categories/parents/' + categoryId);
  }

  updateCustomers(categoryId, categoryObj) {
    return this.httpService.put('/categories/' + categoryId, categoryObj);
  }

  deleteCustomers(data) {
    return this.httpService.post('/cambal-bookings/change-status', data);
  }
}
