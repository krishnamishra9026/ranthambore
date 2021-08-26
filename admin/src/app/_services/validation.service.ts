import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ValidationService {
	constructor() {}
	static required(control) {
		if (
			control.value === undefined ||
			control.value === null ||
			(typeof control.value === 'string' && control.value.trim() === '')
		) {
			return { required: true };
		}
		return null;
	}

	static numberValidator(control) {
		const reg = /^\d+$/;
		if (typeof control.value !== 'undefined' && reg.test(control.value)) {
			return null;
		} else {
			return { invalidNumber: true };
		}
	}

	static greaterThanZeroValidator(control) {
		const reg = /^\d+$/;
		if (typeof control.value !== 'undefined' && reg.test(control.value) && control.value > 0) {
			return null;
		} else {
			return { greaterThanZero: true };
		}
	}

	static emailValidator(control) {
		// RFC 2822 compliant regex
		// tslint:disable-next-line:max-line-length
		const reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		if (typeof control.value !== 'undefined' && reg.test(control.value)) {
			return null;
		} else {
			return { invalidEmailAddress: true };
		}
	}

	static passwordValidator(control) {
		// {6,15}           - Assert password is between 6 and 15 characters
		// (?=.*[0-9])       - Assert a string has at least one number
		const reg = /^[a-zA-Z0-9!@#$%^&*]{6,15}$/;
		if (typeof control.value !== 'undefined' && reg.test(control.value)) {
			return null;
		} else {
			return { invalidPassword: true };
		}
	}

	static urlValidator(control) {
		// tslint:disable-next-line:max-line-length
		const reg = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
		if (typeof control.value !== 'undefined' && reg.test(control.value)) {
			return null;
		} else {
			return { inValidUrl: true };
		}
	}
}
