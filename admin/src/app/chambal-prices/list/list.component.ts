import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonService } from 'src/app/_services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ChambalPricesService } from '../chambal-prices.service';

import { ConfirmModalComponent } from 'src/app/_shared/confirm-modal/confirm-modal.component';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: [ './list.component.scss' ]
})
export class ListComponent implements OnInit, OnDestroy {
	canAdd: boolean;
	canUpdate: boolean;
	canDelete: boolean;
	editing = {};
	keyword: string;
	startDate = '';
	endDate = '';
	chambal_services: any[] = [];
	selected = [];
	filesToUpload: Array<File>;
	selectedItem = [];
	// searchParameters: any = {
	// 	limit: 10,
	// 	offset: 0
	// };
	bsModalRef: BsModalRef = new BsModalRef();
	dismissible = true;
	newDocModalRef: BsModalRef;
	pageInfo: any = {
		count: 0,
		page: 0,
		offset: 0,
		pageSize: 10
	};
	sortOption: any;
	pageLimitOptions: any[];
	searchtxtControl: any = new FormControl();

	@ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

	constructor(
		private modalService: BsModalService,
		private commonService: CommonService,
		private eventService: ChambalPricesService,
		private toastrService: ToastrService
	) {
		this.sortOption = { created: 'desc' };
		  this.filesToUpload = [];
	}

	ngOnInit() {
		this.canAdd = this.commonService.hasPermission('add_category');
		this.canUpdate = this.commonService.hasPermission('update_category');
		this.canDelete = this.commonService.hasPermission('delete_category');
		this.getChambalPrices();
		this.searchtxtControl.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe((value: any) => {
			this.keyword = value;
			this.pageInfo.offset = 0;
			this.getChambalPrices();
		});
	}
	setPage(pageInfo) {
		this.pageInfo.offset = pageInfo.offset * pageInfo.pageSize;
		this.getChambalPrices();
	}





	private getChambalPrices() {
		this.eventService
			.getChambalPricesList({
				keyword: this.keyword,
				offset: this.pageInfo.offset,
				limit: this.pageInfo.pageSize,
				sort: this.sortOption
			})
			.subscribe(
				(res: any) => {
					if (res.success && res.data) {
						this.selected = [];
						this.selectedItem = [];
						this.chambal_services = res.data.docs;
						this.pageInfo.limit = res.data.page;
						this.pageInfo.count = res.data.total;
						this.pageInfo.page = res.data.page;
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err) => {
					this.commonService.showError('', 'There is some problem on getting chambal-services.');
				}
			);
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

	onSort(event) {
		this.sortOption = {};
		this.sortOption[event.sorts[0].prop] = event.sorts[0].dir;
		this.pageInfo.offset = 0;
		this.pageInfo.page = 0;
		this.getChambalPrices();
	}

	updateAvailability(event, cell, id) {

    var val = event.target.value;    

		if (val) {
			this.eventService
				.updateAvailability({
					id: id,
					value: val
				})
				.subscribe(
					(res: any) => {
						if (res && res.success) {
							this.toastrService.success(res.message);
							this.getChambalPrices();
							this.editing[id] = false;
						}
					},
					(error) => {
						this.toastrService.error(error.message);
					}
				);
		} else {
			this.toastrService.error('Please select atleast one category.');
		}
	}

	changeStatus(status, id) {
		if (id) this.selectedItem.push(id);
		if (this.selectedItem && this.selectedItem.length) {
			this.eventService
				.deleteChambalPrices({
					ids: this.selectedItem,
					status: status
				})
				.subscribe(
					(res: any) => {
						if (res && res.success) {
							this.toastrService.success(res.message);
							this.selectedItem = [];
							this.getChambalPrices();
						}
					},
					(error) => {
						this.toastrService.error(error.message);
					}
				);
		} else {
			this.toastrService.error('Please select atleast one category.');
		}
	}

	delete() {
		if (this.selectedItem && this.selectedItem.length) {
			const initialState = {
				title: 'Delete Category',
				message: `Are you sure, you want to Delete <b>${this.selectedItem}</b> category?`
			};
			this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
				initialState,
				class: 'custom-modal',
				backdrop: false
			});
			this.bsModalRef.content.response.subscribe((res: boolean) => {
				if (res) {
					this.eventService
						.deleteChambalPrices({
							ids: this.selectedItem,
							status: 'Delete'
						})
						.subscribe(
							(delRes: any) => {
								if (delRes.success) {
									this.commonService.showSuccess('', 'Category deleted successfully.');
									this.getChambalPrices();
								}
							},
							(err) => {
								this.commonService.showError('', 'There is some problem on Deleting Category.');
							}
						);
				}
				this.bsModalRef.hide();
			});
		} else {
			this.toastrService.error('Please select atleast one category.');
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
		this.getChambalPrices();
	}
	ngOnDestroy() {
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}
}
