import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService, UserService } from 'src/app/_services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditBookingPriceComponent } from './edit-booking-price/edit-booking-price.component';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-header',
	templateUrl: './app-header.component.html',
	styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {
	menu: { isMini: boolean } = { isMini: false };
	userInfo: any = {};
	isOpen = false;

	subscription: Subscription;
	bsModalRef: BsModalRef = new BsModalRef();
	bsChangePasswordModalRef: BsModalRef = new BsModalRef();

	constructor(
		private router: Router,
		private coreService: CommonService,
		private userService: UserService,
		private modalService: BsModalService
	) {
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				if (this.bsModalRef) {
					this.bsModalRef.hide();
				}

				if (this.bsChangePasswordModalRef) {
					this.bsChangePasswordModalRef.hide();
				}
			}
		});
	}

	ngOnInit() {
		this.userInfo = this.userService.getUserInfo();
		this.subscription = this.userService.getUserData.subscribe((value) => (this.userInfo = value));
		this.menu = this.coreService.menu;
	}

	logout() {
		this.userService.clearUserData();
		this.coreService.navigateTo('');
	}

	closeNotifications(event: MouseEvent) {
		if (
			!event.srcElement["className"].includes('btn-notification') &&
			!event.srcElement["className"].includes('ic-notification') &&
			!event.srcElement["className"].includes('notification-active')
		) {
			this.isOpen = false;
		}
	}

	toggleMenu() {
		this.menu.isMini = !this.menu.isMini;
		if (this.menu.isMini) {
			document.body.className = document.body.className.concat(' mini');
		} else {
			document.body.className = document.body.className.replace(' mini', '').replace('mini', '');
		}
	}

	editProfile() {
		this.bsModalRef = this.modalService.show(EditProfileComponent, {
			class: 'custom-modal',
			backdrop: false
		});
		this.subscription = this.bsModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.coreService.showSuccess('', res.message);
			} else if (res) {
				this.coreService.showError('', res.message);
			}
			this.bsModalRef.hide();
		});
	}

	editBookingPrice() {
		this.bsModalRef = this.modalService.show(EditBookingPriceComponent, {
			class: 'custom-modal',
			backdrop: false
		});
		this.subscription = this.bsModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.coreService.showSuccess('', res.message);
			} else if (res) {
				this.coreService.showError('', res.message);
			}
			this.bsModalRef.hide();
		});
	}

	changePassword() {
		this.bsChangePasswordModalRef = this.modalService.show(ChangePasswordModalComponent, {
			class: 'custom-modal',
			backdrop: false
		});
		this.subscription = this.bsChangePasswordModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.coreService.showSuccess('', res.message);
			} else if (res) {
				this.coreService.showError('', res.message);
			}
			this.bsChangePasswordModalRef.hide();
		});
	}
	ngOnDestroy() {
		if (this.bsModalRef) {
			this.bsModalRef.hide();
		}

		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
