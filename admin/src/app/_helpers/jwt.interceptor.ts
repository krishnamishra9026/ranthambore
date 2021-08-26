import { Injectable } from '@angular/core';

import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService, CommonService } from '../_services';

import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	constructor(private authenticationService: AuthenticationService, private commonService: CommonService) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const regExp = new RegExp(/assets/g, 'i');
		request = request.clone({
			url: regExp.test(request.url) ? request.url : `${environment.serviceUrl}${request.url}`
		});
		// add authorization header with jwt token if available
		let currentUser = this.authenticationService.currentUserValue;
		if (currentUser && currentUser.token) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${currentUser.token}`
				}
			});
		}

		return next.handle(request);
	}
}
