import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class CustomersService {
	constructor(private httpService: HttpClient) {}

	getCustomersList(filterObj) {
		return this.httpService.post('/customers/list', filterObj);
	}

	getCustomerDetail(customerId) {
		return this.httpService.get('/customers/' + customerId);
	}

	generatePdfFile(customerObj) {
		return this.httpService.post('/customers/generate-pdf-file' , customerObj);
	}


	sendVoucher(customerObj) {
		return this.httpService.post('/customers/send-voucher' , customerObj);
	}


	getPdfFile(customerObj) {
		return this.httpService.post('/customers/get-pdf-file' , customerObj);
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
		return this.httpService.post('/customers/change-status', data);
	}
}
