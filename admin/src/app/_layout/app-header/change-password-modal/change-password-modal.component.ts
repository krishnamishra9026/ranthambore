import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
	selector: 'app-change-password-modal',
	templateUrl: './change-password-modal.component.html',
	styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {
	@Output() response: EventEmitter<boolean> = new EventEmitter();

	changePasswordForm: FormGroup;
	loading = false;
	submitted = false;

	private userInfo;

	constructor(private fb: FormBuilder, private commonService: CommonService, private userService: UserService) {
		this.userInfo = this.userService.userInfo;
		this.changePasswordForm = this.fb.group({
			oldPassword: [''],
			newPassword: [''],
			confirmNewPassword: ['']
		});
	}

	ngOnInit() { }

	changePassword(changePasswordForm: FormGroup) {
		this.submitted = true;

		if (
			changePasswordForm.invalid ||
			changePasswordForm.get('newPassword').value !== changePasswordForm.get('confirmNewPassword').value
		) {
			return false;
		}

		let changePasswordData = changePasswordForm.value;
		changePasswordData.id = this.userInfo.id;
		this.userService.changePassword(changePasswordData).subscribe(
			(res: any) => {
				if (res && res.success) {
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
