import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService, CommonService } from '../_services';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
	loginForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;
	error = '';
	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private commonService: CommonService
	) {}

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: [ null, Validators.required ],
			password: [ null, Validators.required ]
		});

		// reset login status
		this.authenticationService.logout();

		// get return url from route parameters or default to '/'
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/main';
	}
	get f() {
		return this.loginForm.controls;
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		this.authenticationService.login(this.f.email.value, this.f.password.value).pipe(first()).subscribe(
			(data) => {
				this.router.navigate([ this.returnUrl ]);
			},
			(error) => {
				this.error = error;
				this.loading = false;
				this.commonService.showError('', error);
			}
		);
	}
	login() {
		this.router.navigate([ '/login' ]);
	}
}
