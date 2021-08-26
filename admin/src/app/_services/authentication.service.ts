import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	constructor(private http: HttpClient, private userService: UserService) {
		this.currentUserSubject = new BehaviorSubject<User>(this.userService.getUserInfo());
		this.currentUser = this.currentUserSubject.asObservable();
	}

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}
	public get currentUserSub() {
		return this.currentUserSubject;
	}

	login(email: string, password: string) {
		return this.http.post<any>(`/login`, { email, password }).pipe(
			map((user) => {
				// login successful if there's a jwt token in the response
				if (user && user.data.token) {
					// store user details and jwt token in local storage to keep user logged in between page refreshes
					//localStorage.setItem('currentUser', JSON.stringify(user.data));
					this.userService.storeUserInfo(user.data);
					this.currentUserSubject.next(user.data);
				}

				return user;
			})
		);
	}

	logout() {
		// remove user from local storage to log user out
		//localStorage.removeItem('currentUser');
		this.userService.clearUserData();
		this.currentUserSubject.next(null);
	}
	isLoggedIn() {
		return this.userService.loggedIn();
	}
}
