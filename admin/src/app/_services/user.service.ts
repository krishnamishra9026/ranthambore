import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { CommonService } from './common.service';

@Injectable({ providedIn: 'root' })
export class UserService {
	userInfo: User = new User();
	@Output() getUserData: EventEmitter<any> = new EventEmitter();

	constructor(private http: HttpClient, private commonService: CommonService) {
		if (typeof window !== 'undefined' && localStorage.getItem('dx_user') !== null) {
			const user = JSON.parse(localStorage.getItem('dx_user') || '');
			this.userInfo = user ? user : new User();

			if (!this.loggedIn()) {
				this.commonService.navigateTo('');
			}
		}
	}

	storeUserInfo(res: any) {
		this.userInfo = {
			id: res.user._id,
			firstName: res.user.firstName,
			lastName: res.user.lastName,
			username: res.user.firstName + ' ' + res.user.lastName,
			email: res.user.email,
			type: res.user.type,
			mobile: res.user.mobile,
			logo:
				res.user.profile_pic && res.user.profile_pic.length !== 0
					? res.user.profile_pic[0]
					: 'assets/images/edit-profile-pic.png',
			token: res.token
		};
		localStorage.setItem('dx_token', res.token);
		localStorage.setItem('dx_user', JSON.stringify(this.userInfo));
		localStorage.setItem('capabilities', res.user.roleId.capabilities);
		this.getUserData.emit(this.userInfo);
	}

	getUserInfo() {
		return this.userInfo;
	}	

	loggedIn(): boolean {
		let isLoggedIn = false;

		if (typeof window !== 'undefined') {
			isLoggedIn = localStorage.getItem('dx_token') !== null;
		}

		return isLoggedIn;
	}

	clearUserData() {
		localStorage.removeItem('dx_token');
		localStorage.removeItem('dx_user');
		localStorage.removeItem('capabilities');
		this.userInfo = null;
	}

	updateProfile(userObj) {
		return this.http.put('/users/update-profile', userObj);
	}

	updateBookingPrice(userObj) {
		return this.http.put('/users/update-booking-price', userObj);
	}

	

	changePassword(userObj) {
		return this.http.post('/change-password', userObj);
	}
}
