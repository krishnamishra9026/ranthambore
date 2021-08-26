import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class BrandsService {
	constructor(private httpService: HttpClient) {}

	getBrandsList(filterObj) {
		return this.httpService.post('/brands/list', filterObj);
	}

	createBrand(brandObj) {
		return this.httpService.post('/brands/create', brandObj);
	}

	getBrandDetail(brandId) {
		return this.httpService.get('/brands/' + brandId);
	}

	updateBrands(brandId, brandObj) {
		return this.httpService.put('/brands/' + brandId, brandObj);
	}

	deleteBrand(data) {
		return this.httpService.post('/brands/change-status', data);
	}
}
