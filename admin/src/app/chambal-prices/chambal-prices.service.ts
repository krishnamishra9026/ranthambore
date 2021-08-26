import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChambalPricesService {
  constructor(private httpService: HttpClient) {}

  getChambalPricesList(filterObj) {
    return this.httpService.post('/chambal-prices/list', filterObj);
  }

  createChambalPrices(eventObj) {
    return this.httpService.post('/chambal-prices/create', eventObj);
  }

  getEventDetail(eventId) {
    return this.httpService.get('/chambal-prices/' + eventId);
  }

  getParentEventList(eventId) {
    return this.httpService.get('/chambal-prices/parents/' + eventId);
  }

  updateChambalPrices(eventId, eventObj) {
    return this.httpService.put('/chambal-prices/' + eventId, eventObj);
  }
  updateAvailability(data) {
    return this.httpService.post('/chambal-prices/update-availability', data);
  }

  importCsvFile(userObj) {
    return this.httpService.post('/chambal-prices/upload-csv', userObj);
  }

  deleteChambalPrices(data) {
    return this.httpService.post('/chambal-prices/change-status', data);
  }
}
