import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class EventsService {
	constructor(private httpService: HttpClient) {}

	getEventsList(filterObj) {
		return this.httpService.post('/events/list', filterObj);
	}

	createEvents(eventObj) {
		return this.httpService.post('/events/create', eventObj);
	}

	getEventDetail(eventId) {
		return this.httpService.get('/events/' + eventId);
	}

	getParentEventList(eventId) {
		return this.httpService.get('/events/parents/' + eventId);
	}

	updateEvents(eventId, eventObj) {
		return this.httpService.put('/events/' + eventId, eventObj);
	}
	updateAvailability(data) {
		return this.httpService.post('/events/update-availability', data);
	}

	importCsvFile(userObj) {
		return this.httpService.post('/events/upload-csv', userObj);
	}

	deleteEvents(data) {
		return this.httpService.post('/events/change-status', data);
	}
}
