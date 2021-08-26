import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
	editProfileForm: FormGroup;
	loading = false;
	submitted = false;
	userInfo: any;
	profile_pic: any = 'assets/images/edit-profile-pic.png';
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	constructor(
		private formBuilder: FormBuilder,
		private commonService: CommonService,
		private userService: UserService
	) { }

	ngOnInit() {
		this.userInfo = this.userService.getUserInfo();
		this.profile_pic = this.userInfo.logo || 'assets/images/edit-profile-pic.png';
		this.editProfileForm = this.formBuilder.group({
			firstName: [this.userInfo.firstName ? this.userInfo.firstName : null, Validators.required],
			lastName: [this.userInfo.lastName ? this.userInfo.lastName : null],
			email: [this.userInfo.email ? this.userInfo.email : null, [Validators.required, Validators.email]],
			mobile: [
				this.userInfo.mobile ? this.userInfo.mobile : null,
				[Validators.required, Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]
			],
			profile_pic: [this.userInfo.logo ? this.userInfo.logo : null]
		});
	}

	get editProFrm() {
		return this.editProfileForm.controls;
	}

	onFileChange(event) {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			this.editProfileForm.get('profile_pic').setValue(file);
			this.commonService.getBase64(event.target.files[0]).then((res) => {
				this.profile_pic = res;
			});
		}
	}


	editProfile() {
		this.submitted = true;
		if (this.editProfileForm.invalid) {
			return false;
		}
		const formdata = new FormData();
		formdata.append('email', this.editProfileForm.controls.email.value);
		formdata.append('firstName', this.editProfileForm.controls.firstName.value);

		formdata.append('lastName', this.editProfileForm.controls.lastName.value);
		formdata.append('mobile', this.editProfileForm.controls.mobile.value);
		formdata.append('profile_pic', this.editProfileForm.controls.profile_pic.value);

		this.userService.updateProfile(formdata).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.userService.storeUserInfo(res.data);
					this.response.emit(res);
				} else {
					this.commonService.showError('', res.message);
				}
			},
			(err: any) => {
				this.commonService.showError('', err.error.message);
			}
		);
	}

	closeModal() {
		this.response.emit();
	}
}
