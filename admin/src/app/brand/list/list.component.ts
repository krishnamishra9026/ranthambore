import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { CommonService } from 'src/app/_services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { BrandsService } from '../brands.service';

import { ConfirmModalComponent } from 'src/app/_shared/confirm-modal/confirm-modal.component';
import { ManageComponent } from '../manage/manage.component';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: [ './list.component.scss' ]
})
export class ListComponent implements OnInit, OnDestroy {
	canAdd: boolean;
	canUpdate: boolean;
	canDelete: boolean;

	keyword: string;
	startDate = '';
	endDate = '';
	brands: any[] = [];
	selected = [];
	selectedItem = [];
	searchParameters: any = {
		limit: 10,
		offset: 0
	};
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
		private brandService: BrandsService,
		private toastrService: ToastrService
	) {
		this.sortOption = { created: 'desc' };
	}

	ngOnInit() {
		this.canAdd = this.commonService.hasPermission('add_brand');
		this.canUpdate = this.commonService.hasPermission('update_brand');
		this.canDelete = this.commonService.hasPermission('delete_brand');

		this.getBrands();
		this.searchtxtControl.valueChanges.pipe(debounceTime(250)).subscribe((value: any) => {
			this.keyword = value;
			this.pageInfo.offset = 0;
			this.getBrands();
		});
	}
	setPage(pageInfo) {
		this.pageInfo.offset = pageInfo.offset * pageInfo.pageSize;
		this.getBrands();
	}

	create() {
		this.newDocModalRef = this.modalService.show(ManageComponent, {
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Brand added successfully', 'Add');
				this.getBrands();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	update(id) {
		const initialState = {
			brandId: id
		};

		this.newDocModalRef = this.modalService.show(ManageComponent, {
			initialState,
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Brand udpated successfully', 'Update');
				this.getBrands();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	private getBrands() {
		this.brandService
			.getBrandsList({
				keyword: this.keyword,
				offset: this.pageInfo.offset,
				limit: this.pageInfo.pageSize,
				sort: this.sortOption,
				startDate: this.startDate,
				endDate: this.endDate
			})
			.subscribe(
				(res: any) => {
					if (res.success && res.data) {
						this.selected = [];
						this.selectedItem = [];
						this.brands = res.data.docs;
						this.pageInfo.limit = res.data.page;
						this.pageInfo.count = res.data.total;
						this.pageInfo.page = res.data.page;
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err) => {
					this.commonService.showError('', 'There is some problem on getting brands.');
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
		this.getBrands();
	}

	changeStatus(status, id) {
		if (id) this.selectedItem.push(id);
		if (this.selectedItem && this.selectedItem.length) {
			this.brandService
				.deleteBrand({
					ids: this.selectedItem,
					status: status
				})
				.subscribe(
					(res: any) => {
						if (res && res.success) {
							this.toastrService.success(res.message);
							this.selectedItem = [];
							this.getBrands();
						}
					},
					(error) => {
						this.toastrService.error(error.message);
					}
				);
		} else {
			this.toastrService.error('Please select atleast one brand.');
		}
	}

	delete() {
		if (this.selectedItem && this.selectedItem.length) {
			const initialState = {
				title: 'Delete Brand',
				message: `Are you sure, you want to Delete <b>${this.selectedItem}</b> brand?`
			};
			this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
				initialState,
				class: 'custom-modal',
				backdrop: false
			});
			this.bsModalRef.content.response.subscribe((res: boolean) => {
				if (res) {
					this.brandService
						.deleteBrand({
							ids: this.selectedItem,
							status: 'Delete'
						})
						.subscribe(
							(delRes: any) => {
								if (delRes.success) {
									this.commonService.showSuccess('', 'Brand deleted successfully.');
									this.getBrands();
								}
							},
							(err) => {
								this.commonService.showError('', 'There is some problem on Deleting Brand.');
							}
						);
				}
				this.bsModalRef.hide();
			});
		} else {
			this.toastrService.error('Please select atleast one brand.');
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
		this.getBrands();
	}

	ngOnDestroy() {
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}
}
