import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class SharedService {
	constructor(private httpService: HttpClient) {}

	getAllBrands() {
		return this.httpService.get('/brands/');
	}

	getCategories() {
		return this.httpService.get('/categories/parents');
	}

	getBookingPriceInfo() {
	console.log('dsfsdf');
		return this.httpService.get('/customers/get-booking-prices');
	}

	getParentCategories() {
		return this.httpService.get('/categories/parents/' + 'undefined');
	}

	getChildCategories(parentId) {
		return this.httpService.get('/categories/' + parentId + '/childs');
	}
	getAllCapabilities() {
		return this.httpService.get('/capabilities/all');
	}
}
