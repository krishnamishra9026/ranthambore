import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class FaqService {
	constructor(private httpService: HttpClient) {}

	// getFAQDetail(id) {
	// 	return this.http.get('/faq/' + id);
	// }

	// getFAQList(body) {
	// 	return this.http.post('/faq/list', body);
	// }

	// deleteFAQ(ids) {
	// 	return this.http.post('/faq/remove', ids);
	// }
	// saveFAQ(data) {
	// 	return this.http.post('/faq/create', data);
	// }
	// updateFAQ(id, data) {
	// 	return this.http.put('/faq/' + id, data);
	// }
	// changeStatus(data) {
	// 	return this.http.post('/faq/change-status', data);
	// }

	// --new

	getfaqList(body) {
		return this.httpService.post('/faq/list', body);
	}

	createFAQ(faqObj) {
		return this.httpService.post('/faq/create', faqObj);
	}

	getFaqDetail(faqId) {
		return this.httpService.get('/faq/' + faqId);
	}

	updateFAQ(faqId, faqObj) {
		return this.httpService.put('/faq/' + faqId, faqObj);
	}

	deleteFAQ(data) {
		return this.httpService.post('/faq/change-status', data);
	}
}
