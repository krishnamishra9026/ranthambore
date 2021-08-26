import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class RolesService {
	constructor(private http: HttpClient) {}

	getRoles() {
		return this.http.post('/roles/list', '');
	}

	getRoleDetail(roleId: string) {
		return this.http.get('/roles/' + roleId);
	}

	assignCapabilitiesToRole(roleId: string, body) {
		return this.http.put('/roles/' + roleId, body);
	}
}
