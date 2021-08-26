import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
//import { CommonService } from 'src/app/_services/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CustomersService } from '../customers.service';
import { ManageComponent } from '../manage/manage.component';
import { CommonService } from '../../_services/common.service';

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
	customers: any[] = [];
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
		private customerService: CustomersService,
		private toastrService: ToastrService
	) {
		this.sortOption = { created: 'desc' };
	}

	ngOnInit() {
		this.canAdd = this.commonService.hasPermission('add_category');
		this.canUpdate = this.commonService.hasPermission('update_category');
		this.canDelete = this.commonService.hasPermission('delete_category');
		this.getcustomers();
		this.searchtxtControl.valueChanges.pipe(debounceTime(250), distinctUntilChanged()).subscribe((value: any) => {
			this.keyword = value;
			this.pageInfo.offset = 0;
			this.getcustomers();
		});
	}
	setPage(pageInfo) {
		this.pageInfo.offset = pageInfo.offset * pageInfo.pageSize;
		this.getcustomers();
	}
	
	create() {
		this.newDocModalRef = this.modalService.show(ManageComponent, {
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Category added successfully', 'Add');
				this.getcustomers();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	update(id: any) {
		const initialState = {
			customerId: id
		};

		if (id) this.selectedItem.push(id);
			this.customerService
				.deleteCustomers({
					ids: this.selectedItem,
					status: "Active"
				})
				.subscribe(
					(res: any) => {
						this.refreshList();
					},
					(error) => {
						//this.toastrService.error(error.message);
					}
				);

		this.newDocModalRef = this.modalService.show(ManageComponent, {
			initialState,
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Category udpated successfully', 'Update');
				this.getcustomers();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}


	private getcustomers() {
		this.customerService
			.getCustomersList({
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
						this.customers = res.data.docs;
						this.pageInfo.limit = res.data.page;
						this.pageInfo.count = res.data.total;
						this.pageInfo.page = res.data.page;
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err) => {
					this.commonService.showError('', 'There is some problem on getting customers.');
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
		this.getcustomers();
	}


	refreshList() {
		this.keyword = '';
		this.pageInfo.offset = 0;
		this.pageInfo.pageSize = 10;
		this.sortOption = { created: 'desc' };
		this.selected = [];
		this.selectedItem = [];
		this.searchtxtControl.setValue('');
		this.getcustomers();
	}
	ngOnDestroy() {
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}
}
