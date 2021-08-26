import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmailService } from './../email.service';

import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_services';
import { ValidationService } from 'src/app/_services/validation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'ngx-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit {
	public emailForm: FormGroup;
	submitted: boolean;
	public config: any;
	public emailID: string;
	public emailDetails: any;
	public variables: any[];
	errorMsg: string;
	alertEditor = false;
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	subscription: Subscription;
	option: any = {};

	constructor(
		public fb: FormBuilder,
		private emailService: EmailService,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private toastrService: ToastrService
	) {
		this.config = this.commonService.ckEditorConfig;
		this.initForm(this.option);
	}

	private initForm(values: any) {
		this.emailForm = this.fb.group({
			title: new FormControl(
				values.title ? values.title : '',
				Validators.compose([ ValidationService.required ])
			),
			subject: new FormControl(
				values.subject ? values.subject : '',
				Validators.compose([ ValidationService.required ])
			),
			fromName: new FormControl(
				values.fromName ? values.fromName : '',
				Validators.compose([ ValidationService.required ])
			),
			fromEmail: new FormControl(
				values.fromEmail ? values.fromEmail : '',
				Validators.compose([ ValidationService.required, Validators.email ])
			),
			bcc: new FormControl(values.bcc ? values.bcc : ''),
			cc: new FormControl(values.cc ? values.cc : ''),
			message: new FormControl(values.message ? values.message : '', Validators.compose([ Validators.required ]))
		});
	}
	ngOnInit() {
		this.config.removeButtons = 'Underline,Subscript,Superscript,SpecialChar,Source';
		this.emailService.getEmailDetails(this.emailID).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.variables = res.data.variables ? res.data.variables : [];
					this.initForm(res.data);
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
	}

	// tslint:disable-next-line:use-life-cycle-interface
	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	saveEmail() {
		this.submitted = true;
		if (!this.emailForm.valid) {
			this.commonService.showError('error', 'Please enter valid data');
		}
		if (this.emailForm.valid) {
			this.emailService.updatePage(this.emailID, this.emailForm.value).subscribe(
				(res: any) => {
					if (res && res.success) {
						this.response.emit(res);
					} else {
						this.commonService.showError('error', res.message);
					}
				},
				(err) => {
					this.commonService.showError('error', err);
				}
			);
		}
	}

	close() {
		this.response.emit();
	}
}
