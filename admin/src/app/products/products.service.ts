import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ProductsService {
	constructor(private httpService: HttpClient) {}
	getProductsList(filterObj) {
		return this.httpService.post('/products/list', filterObj);
	}
	createProduct(productObj) {
		return this.httpService.post('/products/create', productObj);
	}
	getProductDetail(productId) {
		return this.httpService.get('/products/' + productId);
	}
	updateproduct(productId, productObj) {
		return this.httpService.put('/products/' + productId, productObj);
	}
	deleteProduct(data) {
		return this.httpService.post('/products/change-status', data);
	}
}
