import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProductsService } from '../products.service';
import { CommonService } from 'src/app/_services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ManageComponent } from '../manage/manage.component';
import { ConfirmModalComponent } from 'src/app/_shared/confirm-modal/confirm-modal.component';
import { debounceTime } from 'rxjs/operators';

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
	pageInfo: any = {
		count: 0,
		page: 0,
		offset: 0,
		pageSize: 10
	};
	products: any[] = [];
	selected = [];
	selectedItem = [];
	bsModalRef: BsModalRef = new BsModalRef();
	dismissible = true;
	newDocModalRef: BsModalRef;
	sortOption: any;
	pageLimitOptions: any[];
	searchtxtControl: any = new FormControl();

	@ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

	constructor(
		private productService: ProductsService,
		private modalService: BsModalService,
		private commonService: CommonService,
		private toastrService: ToastrService
	) {
		this.sortOption = { created: 'desc' };
	}

	ngOnInit() {
		this.canAdd = this.commonService.hasPermission('add_product');
		this.canUpdate = this.commonService.hasPermission('update_product');
		this.canDelete = this.commonService.hasPermission('delete_product');

		this.getProductList();
		this.searchtxtControl.valueChanges.pipe(debounceTime(250)).subscribe((value: any) => {
			this.keyword = value;
			this.pageInfo.offset = 0;
			this.getProductList();
		});
	}

	getProductList() {
		this.productService
			.getProductsList({
				keyword: this.keyword,
				offset: this.pageInfo.offset,
				limit: this.pageInfo.pageSize,
				sort: this.sortOption
			})
			.subscribe(
				(res: any) => {
					if (res && res.success) {
						this.selected = [];
						this.selectedItem = [];
						this.products = res.data.docs;
						this.pageInfo.limit = res.data.page;
						this.pageInfo.count = res.data.total;
						this.pageInfo.page = res.data.page;
					}
				},
				(err) => {}
			);
	}

	create() {
		this.newDocModalRef = this.modalService.show(ManageComponent, {
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Product added successfully', 'Add');
				this.getProductList();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	update(id) {
		const initialState = {
			productId: id
		};

		this.newDocModalRef = this.modalService.show(ManageComponent, {
			initialState,
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Product udpated successfully', 'Update');
				this.getProductList();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	setPage(pageInfo) {
		this.pageInfo.offset = pageInfo.offset * pageInfo.pageSize;
		this.getProductList();
	}
	pageLimit(num: number) {
		this.pageInfo.pageSize = Number(num);
		if (this.products) this.table.pageSize = Number(num);
	}

	onSort(event) {
		this.sortOption = {};
		this.sortOption[event.sorts[0].prop] = event.sorts[0].dir;
		this.pageInfo.offset = 0;
		this.pageInfo.page = 0;
		this.getProductList();
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

	changeStatus(status, id) {
		if (id) this.selectedItem.push(id);
		if (this.selectedItem && this.selectedItem.length) {
			this.productService
				.deleteProduct({
					ids: this.selectedItem,
					status: status
				})
				.subscribe(
					(res: any) => {
						if (res && res.success) {
							this.toastrService.success(res.message);
							this.selectedItem = [];
							this.getProductList();
						}
					},
					(error) => {
						this.toastrService.error(error.message);
					}
				);
		} else {
			this.toastrService.error('Please select atleast one product.');
		}
	}

	delete() {
		if (this.selectedItem && this.selectedItem.length) {
			const initialState = {
				title: 'Delete Product',
				message: `Are you sure, you want to Delete <b>${this.selectedItem}</b> product?`
			};
			this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
				initialState,
				class: 'custom-modal',
				backdrop: false
			});
			this.bsModalRef.content.response.subscribe((res: boolean) => {
				if (res) {
					this.productService
						.deleteProduct({
							ids: this.selectedItem,
							status: 'Delete'
						})
						.subscribe(
							(delRes: any) => {
								if (delRes.success) {
									this.commonService.showSuccess('', 'Product deleted successfully.');
									this.getProductList();
								}
							},
							(err) => {
								this.commonService.showError('', 'There is some problem on Deleting Product.');
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
		this.getProductList();
	}

	ngOnDestroy() {
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}
}
