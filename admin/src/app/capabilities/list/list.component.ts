import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ToastrService } from 'ngx-toastr';
import { CapabilitiesService } from './../capabilities.service';

import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/_services';
import { ConfirmModalComponent } from 'src/app/_shared/confirm-modal/confirm-modal.component';
import { ManageComponent } from '../manage/manage.component';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: [ './list.component.scss' ]
})
export class ListComponent implements OnInit, OnDestroy {
	canAdd: boolean;
	canDelete: boolean;
	records = [];
	pageInfo: any = {
		count: 0,
		pageNumber: 0,
		offset: 0,
		pageSize: 10
	};
	selected = [];
	selectedItem = [];
	keyword: string;
	searchtxtControl = new FormControl();
	sortOption: any;
	subscription: Subscription;

	bsModalRef: BsModalRef = new BsModalRef();
	dismissible = true;
	newDocModalRef: BsModalRef;
	constructor(
		private modalService: BsModalService,
		private capabilitiesService: CapabilitiesService,
		private commonService: CommonService,
		private toastrService: ToastrService
	) {
		this.sortOption = { name: 'desc' };
	}

	ngOnInit() {
		this.canAdd = this.commonService.hasPermission('add_capabilities');
		this.canDelete = this.commonService.hasPermission('delete_capabilities');
		this.getCapabilities();
		this.subscription = this.searchtxtControl.valueChanges.pipe(debounceTime(250)).subscribe((value: any) => {
			this.keyword = value;
			this.pageInfo.offset = 0;
			this.getCapabilities();
		});
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}
	getCapabilities() {
		this.capabilitiesService
			.getCapabilities({
				keyword: this.keyword,
				offset: this.pageInfo.offset,
				limit: this.pageInfo.pageSize,
				sort: this.sortOption
			})
			.subscribe(
				(res: any) => {
					if (res && res.data && res.data.docs) {
						this.selected = [];
						this.records = res.data.docs;
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

	create() {
		this.newDocModalRef = this.modalService.show(ManageComponent, {
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success(res.message, 'Add');
				this.getCapabilities();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	setPage(pageInfo) {
		this.pageInfo.offset = pageInfo.offset * pageInfo.pageSize;
		this.getCapabilities();
	}

	updateFilter(event) {
		this.keyword = event.target.value.toLowerCase();
	}

	onSort(event) {
		this.sortOption = {};
		this.sortOption[event.sorts[0].prop] = event.sorts[0].dir;
		this.pageInfo.offset = 0;
		this.pageInfo.page = 0;
		this.getCapabilities();
	}

	onSelect({ selected }) {
		if (selected && selected.length > 0) {
			this.selectedItem = [];
			selected.forEach((selectedEle) => {
				this.selectedItem.push(selectedEle.id);
			});
		} else {
			this.selectedItem = [];
		}
	}

	delete() {
		if (this.selectedItem && this.selectedItem.length) {
			const initialState = {
				title: 'Delete Category',
				message: `Are you sure, you want to Delete <b>${this.selectedItem}</b> this Capability?`
			};
			this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
				initialState,
				class: 'custom-modal',
				backdrop: false
			});
			this.bsModalRef.content.response.subscribe((res: boolean) => {
				if (res) {
					this.capabilitiesService
						.deleteCapabilities({
							ids: this.selectedItem
						})
						.subscribe(
							(delRes: any) => {
								if (delRes.success) {
									//this.commonService.showSuccess('', 'Category deleted successfully.');
									this.toastrService.success(delRes.message);
									this.selectedItem = [];
									this.getCapabilities();
								} else {
									this.toastrService.error(delRes.message);
								}
							},
							(err) => {
								//this.commonService.showError('', 'There is some problem on Deleting Category.');
								this.toastrService.error(err.message);
							}
						);
				}
				this.bsModalRef.hide();
			});
		} else {
			this.toastrService.error('Please select atleast one Capability.');
		}
	}

	refreshList() {
		this.keyword = '';
		this.pageInfo.offset = 0;
		this.pageInfo.pageSize = 10;
		this.sortOption = { created: 'desc' };
		this.selected = [];
		this.selectedItem = [];
		this.searchtxtControl.setValue('');
		this.getCapabilities();
	}
}
