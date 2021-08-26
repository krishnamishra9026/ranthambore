import { Injectable } from '@angular/core';
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonService } from './common.service';

@Injectable({
	providedIn: 'root'
})
export class APIResolverService implements Resolve<any> {
	constructor(private router: Router, private http: HttpClient, private coreService: CommonService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		const api = route.data.detailApi;
		return this.http.get(api + route.params.id).pipe(
			map((res: any) => {
				if (res && res.success) {
					return res.data;
				} else {
					this.coreService.showError(res.message, 'error');
					this.router.navigate([ route.data.redirectTo ]);
					return null;
				}
			})
		);
	}
}
