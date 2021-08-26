import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { PagesService } from './../pages.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/_services';
import { ManageComponent } from '../manage/manage.component';

@Component({
	selector: 'ngx-list',
	templateUrl: './list.component.html',
	styleUrls: [ './list.component.scss' ]
})
export class ListComponent implements OnInit, OnDestroy {
	canAdd = this.commonService.hasPermission('add_page');
	canUpdate = this.commonService.hasPermission('update_page');
	canDelete = this.commonService.hasPermission('delete_page');

	pages: Array<any> = [];
	providerList: Array<any> = [];
	editing = {};
	rows = [];
	temp = [];
	selected = [];
	selectedItem = [];
	reorderable = true;
	keyword = '';
	pageInfo: any = {
		count: 0,
		page: 0,
		offset: 0,
		pageSize: 10
	};
	sortOption: any;
	searchtxtControl = new FormControl();

	bsModalRef: BsModalRef = new BsModalRef();
	dismissible = true;
	newDocModalRef: BsModalRef;

	@ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

	constructor(
		private modalService: BsModalService,
		private pagesService: PagesService,
		private toastrService: ToastrService,
		private commonService: CommonService
	) {
		this.sortOption = { created: 'desc' };
	}

	ngOnInit() {
		this.canAdd = this.commonService.hasPermission('add_page');
		this.getPages();
		this.watchFilters();
	}
	ngOnDestroy() {
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}

	private watchFilters() {
		this.searchtxtControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
			this.pageInfo.offset = 0;
			this.keyword = value;
			this.getPages();
		});
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
	setPage(pageInfo) {
		this.pageInfo.offset = pageInfo.offset * pageInfo.pageSize;
		this.getPages();
	}

	getPages() {
		this.pagesService
			.getPages({
				keyword: this.keyword,
				offset: this.pageInfo.offset,
				limit: this.pageInfo.pageSize,
				sort: this.sortOption
			})
			.subscribe(
				(res: any) => {
					if (res && res.success && res.data) {
						this.providerList = res.data.docs;
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
		this.getPages();
	}

	update(id) {
		const initialState = {
			pageId: id
		};

		this.newDocModalRef = this.modalService.show(ManageComponent, {
			initialState,
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Page udpated successfully', 'Update');
				this.getPages();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	changeStatus(status, id) {
		if (id) this.selectedItem.push(id);
		if (this.selectedItem && this.selectedItem.length) {
			this.pagesService
				.deletePage({
					ids: this.selectedItem,
					status: status
				})
				.subscribe(
					(res: any) => {
						if (res && res.success) {
							this.toastrService.success(res.message);
							this.selectedItem = [];
							this.getPages();
						}
					},
					(error) => {
						this.toastrService.error(error.message);
					}
				);
		} else {
			this.toastrService.error('Please select atleast one page.');
		}
	}
	refreshList() {
		this.keyword = '';
		this.selectedItem = [];
		this.selected = [];
		this.getPages();
		this.searchtxtControl.setValue('');
		this.watchFilters();
	}
}
