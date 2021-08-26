import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, AbstractControl } from '@angular/forms';

@Injectable({
	providedIn: 'root'
})
export class CommonService {
	public loginlayout = { layout: 'login' };
	menu: { isMini: boolean } = { isMini: false };

	ckEditorConfig = {
		uiColor: '#F0F3F4',
		height: '350',
		extraPlugins: 'divarea',
		toolbar: [
			{
				name: 'clipboard',
				items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ]
			},
			{
				name: 'basicstyles',
				items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ]
			},
			{
				name: 'paragraph',
				items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'CreateDiv', '-', 'Blockquote' ]
			},
			{
				name: 'justify',
				items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ]
			},
			{
				name: 'styles',
				items: [ 'Styles', 'Format', 'FontSize', '-', 'TextColor', 'BGColor' ]
			}
		]
	};

	constructor(private router: Router, private toastr: ToastrService) {}

	navigateTo(url: string) {
		this.router.navigate([ url ]);
	}

	markAsTouchedFormControls(form) {
		Object.keys(form.controls).forEach((field) => {
			const control = form.get(field);
			control.markAsTouched({ onlySelf: true });
		});
	}

	resetForm(formGroup: FormGroup) {
		let control: AbstractControl = null;
		formGroup.reset();
		formGroup.markAsUntouched();
		Object.keys(formGroup.controls).forEach((name) => {
			control = formGroup.controls[name];
			control.setErrors(null);
		});
	}
	getBase64(file: Blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	deepCopy(value) {
		return value ? JSON.parse(JSON.stringify(value)) : [];
	}

	showSuccess(title, message) {
		this.toastr.success(message, title);
	}

	showInfo(title, message) {
		this.toastr.info(message, title);
	}

	showError(title, message) {
		this.toastr.error(message, title);
	}

	showWarning(title, message) {
		this.toastr.warning(message, title);
	}
	public retrieve(key: string): any {
		return localStorage[key];
	}

	public hasPermission(code: string): boolean {
		const user = this.retrieve('capabilities');
		const userCapabilities = user;
		if (code === null) {
			return true;
		}
		if (userCapabilities && userCapabilities.indexOf(code) > -1) {
			return true;
		} else {
			return false;
		}
	}
}
