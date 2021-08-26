import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BookingPricesService {
	constructor(private httpService: HttpClient) {}

	getBookingPricesList(filterObj) {
		return this.httpService.post('/booking-prices/list', filterObj);
	}

	createBookingPrices(eventObj) {
		return this.httpService.post('/booking-prices/create', eventObj);
	}

	getEventDetail(eventId) {
		return this.httpService.get('/booking-prices/' + eventId);
	}

	getParentEventList(eventId) {
		return this.httpService.get('/booking-prices/parents/' + eventId);
	}

	updateBookingPrices(eventId, eventObj) {
		return this.httpService.put('/booking-prices/' + eventId, eventObj);
	}
	updateAvailability(data) {
		return this.httpService.post('/booking-prices/update-availability', data);
	}

	importCsvFile(userObj) {
		return this.httpService.post('/booking-prices/upload-csv', userObj);
	}

	deleteBookingPrices(data) {
		return this.httpService.post('/booking-prices/change-status', data);
	}
}
