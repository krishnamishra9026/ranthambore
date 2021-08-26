import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CategoriesService {
	constructor(private httpService: HttpClient) {}

	getCategoriesList(filterObj) {
		return this.httpService.post('/categories/list', filterObj);
	}

	createCategories(categoryObj) {
		return this.httpService.post('/categories/create', categoryObj);
	}

	getCategoryDetail(categoryId) {
		return this.httpService.get('/categories/' + categoryId);
	}


	getParentCategoryList(categoryId) {
		return this.httpService.get('/categories/parents/' + categoryId);
	}

	updateCategories(categoryId, categoryObj) {
		return this.httpService.put('/categories/' + categoryId, categoryObj);
	}

	deleteCategories(data) {
		return this.httpService.post('/categories/change-status', data);
	}
}
