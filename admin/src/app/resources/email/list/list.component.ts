import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { DatatableComponent } from '@swimlane/ngx-datatable';

import { EmailService } from './../email.service';
import { CommonService } from 'src/app/_services';
import { ManageComponent } from '../manage/manage.component';

@Component({
	selector: 'ngx-list',
	templateUrl: './list.component.html',
	styleUrls: [ './list.component.scss' ]
})
export class ListComponent implements OnInit, OnDestroy {
	canUpdate: boolean;
	rows = [];
	pageInfo: any = {
		count: 0,
		pageNumber: 0,
		offset: 0,
		pageSize: 10
	};
	emailList: any;
	keyword: string;
	searchtxtControl = new FormControl();
	sortOption: any;
	subscription: Subscription;

	bsModalRef: BsModalRef = new BsModalRef();
	dismissible = true;
	newDocModalRef: BsModalRef;

	@ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
	constructor(
		private modalService: BsModalService,
		private emailService: EmailService,
		private route: Router,
		private toastrService: ToastrService,
		private commonService: CommonService
	) {
		this.sortOption = { created: 'desc' };
	}

	ngOnInit() {
		this.canUpdate = true; //this.commonService.hasPermission('update_systememails');
		this.getEmailList();
		this.subscription = this.searchtxtControl.valueChanges.pipe(debounceTime(250)).subscribe((value: any) => {
			this.keyword = value;
			this.pageInfo.offset = 0;
			this.getEmailList();
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}

	setPage(pageInfo) {
		this.pageInfo.offset = pageInfo.offset * pageInfo.pageSize;
		this.getEmailList();
	}

	getEmailList() {
		this.emailService
			.getEmailList({
				keyword: this.keyword,
				offset: this.pageInfo.offset,
				limit: this.pageInfo.pageSize,
				sort: this.sortOption
			})
			.subscribe(
				(res: any) => {
					if (res && res.success) {
						this.emailList = res.data.docs;
						this.pageInfo.limit = res.data.page;
						this.pageInfo.page = res.data.page;
						this.pageInfo.count = res.data.total;
					}
				},
				(error) => {
					this.toastrService.error(error.error.message);
				}
			);
	}

	onSort(event) {
		this.sortOption = {};
		this.sortOption[event.sorts[0].prop] = event.sorts[0].dir;
		this.getEmailList();
	}

	update(id: any) {
		const initialState = {
			emailID: id
		};

		this.newDocModalRef = this.modalService.show(ManageComponent, {
			initialState,
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Category udpated successfully', 'Update');
				this.getEmailList();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}
}
