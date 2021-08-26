import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/_services';
import { ToastrService } from 'ngx-toastr';
import { FaqService } from '../faq.service';
import { ActivatedRoute } from '@angular/router';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit {
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	faqForm: FormGroup;
	submitted: boolean;
	faqID: any;
	option: any = {};

	constructor(
		public fb: FormBuilder,
		public commonService: CommonService,
		public toastServcie: ToastrService,
		public faqService: FaqService,
		public route: ActivatedRoute
	) {
		this.initForm(this.option);
	}

	ngOnInit() {
		this.response = new EventEmitter();
		this.faqService.getFaqDetail(this.faqID).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.initForm(res.data);
				}
			},
			(error: any) => {
				this.commonService.showError('', error.error.message);
			}
		);
	}

	initForm(option) {
		this.faqForm = this.fb.group({
			question: new FormControl(
				option.question ? option.question : '',
				Validators.compose([ ValidationService.required ])
			),
			answer: new FormControl(
				option.answer ? option.answer : '',
				Validators.compose([ ValidationService.required ])
			),
			active: new FormControl(option.active ? option.active : false),
			seq_no: new FormControl(
				option.seq_no ? option.seq_no : null,
				Validators.compose([ ValidationService.required ])
			)
		});
	}

	save(faqForm: FormGroup) {
		this.submitted = true;
		if (this.faqForm.invalid) {
			return false;
		}

		if (!this.faqID) {
			const categoryData = faqForm.value;
			this.faqService.createFAQ(categoryData).subscribe(
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
		} else {
			this.faqService.updateFAQ(this.faqID, faqForm.value).subscribe(
				(res: any) => {
					if (res && res.success) {
						this.response.emit(res);
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err) => {
					this.commonService.showError('', err.message);
				}
			);
		}
	}

	close() {
		this.response.emit();
	}
}
