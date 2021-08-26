import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authenticationService: AuthenticationService) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		const currentUser = this.authenticationService.currentUserValue;
		if (currentUser && currentUser.token) {
			// logged in so return true
			return true;
		}
		console.log(state);
		// not logged in so redirect to login page with the return url
		this.router.navigate([ '' ], { queryParams: { returnUrl: state.url } });
		return false;
	}
}
