import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonService } from 'src/app/_services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CategoriesService } from '../categories.service';

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
	categories: any[] = [];
	selected = [];
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
		private categoryService: CategoriesService,
		private toastrService: ToastrService
	) {
		this.sortOption = { created: 'desc' };
	}

	ngOnInit() {
		this.canAdd = this.commonService.hasPermission('add_category');
		this.canUpdate = this.commonService.hasPermission('update_category');
		this.canDelete = this.commonService.hasPermission('delete_category');
		this.getCategories();
		this.searchtxtControl.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe((value: any) => {
			this.keyword = value;
			this.pageInfo.offset = 0;
			this.getCategories();
		});
	}
	setPage(pageInfo) {
		this.pageInfo.offset = pageInfo.offset * pageInfo.pageSize;
		this.getCategories();
	}

	create() {
		this.newDocModalRef = this.modalService.show(ManageComponent, {
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Category added successfully', 'Add');
				this.getCategories();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	update(id: any) {
		const initialState = {
			categoryId: id
		};

		this.newDocModalRef = this.modalService.show(ManageComponent, {
			initialState,
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Category udpated successfully', 'Update');
				this.getCategories();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	private getCategories() {
		this.categoryService
			.getCategoriesList({
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
						this.categories = res.data.docs;
						this.pageInfo.limit = res.data.page;
						this.pageInfo.count = res.data.total;
						this.pageInfo.page = res.data.page;
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err) => {
					this.commonService.showError('', 'There is some problem on getting categories.');
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
		this.getCategories();
	}
	changeStatus(status, id) {
		if (id) this.selectedItem.push(id);
		if (this.selectedItem && this.selectedItem.length) {
			this.categoryService
				.deleteCategories({
					ids: this.selectedItem,
					status: status
				})
				.subscribe(
					(res: any) => {
						if (res && res.success) {
							this.toastrService.success(res.message);
							this.selectedItem = [];
							this.getCategories();
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
					this.categoryService
						.deleteCategories({
							ids: this.selectedItem,
							status: 'Delete'
						})
						.subscribe(
							(delRes: any) => {
								if (delRes.success) {
									this.commonService.showSuccess('', 'Category deleted successfully.');
									this.getCategories();
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
		this.getCategories();
	}
	ngOnDestroy() {
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}
}
