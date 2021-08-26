import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable()
export class BookingPriceService {
  constructor(private http: HttpClient) {}

  getBookingPrice() {
    return this.http.get('/customers/get-booking-prices');
  }

  updateBookingPrice(body) {
    return this.http.put('/customers/update-booking-prices', body);
  }
}
