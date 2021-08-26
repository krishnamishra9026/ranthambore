import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FaqService } from '../faq.service';
import { CommonService } from 'src/app/_services';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/_shared/confirm-modal/confirm-modal.component';
import { ManageComponent } from '../manage/manage.component';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: [ './list.component.scss' ]
})
export class ListComponent implements OnInit, OnDestroy {
	searchtxtControl = new FormControl();
	faqList = [];
	keyword: string;
	pageInfo: any = {
		count: 0,
		page: 0,
		offset: 0,
		pageSize: 10
	};
	canAdd: boolean;
	canUpdate: boolean;
	canDelete: boolean;
	selectedItem = [];
	sortOption: any;
	selected = [];

	bsModalRef: BsModalRef = new BsModalRef();
	dismissible = true;
	newDocModalRef: BsModalRef;

	constructor(
		private modalService: BsModalService,
		public faqService: FaqService,
		public commonService: CommonService,
		public toastrService: ToastrService
	) {
		this.sortOption = { name: 'asc' };
	}

	ngOnInit() {
		this.canAdd = this.commonService.hasPermission('add_faq');
		this.canUpdate = this.commonService.hasPermission('update_faq');
		this.canDelete = this.commonService.hasPermission('delete_faq');
		this.getFAQsList();
		this.watchFilters();
	}

	private watchFilters() {
		this.searchtxtControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
			this.keyword = value;
			this.pageInfo.offset = 0;
			this.getFAQsList();
		});
	}
	getFAQsList() {
		this.faqService
			.getfaqList({
				keyword: this.keyword,
				offset: this.pageInfo.offset,
				limit: this.pageInfo.pageSize,
				sort: this.sortOption
			})
			.subscribe(
				(response: any) => {
					if (response && response.data && response.data.docs) {
						this.selected = [];
						this.faqList = response.data.docs;
						this.pageInfo.limit = response.data.page;
						this.pageInfo.page = response.data.page;
						this.pageInfo.count = response.data.total;
					} else {
						this.toastrService.error(response.message);
					}
				},
				(error) => {
					this.toastrService.error(error.error.message, 'Sorry no data found');
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
				this.toastrService.success('FAQ added successfully', 'Add');
				this.getFAQsList();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	update(id) {
		const initialState = {
			faqID: id
		};

		this.newDocModalRef = this.modalService.show(ManageComponent, {
			initialState,
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('FAQ udpated successfully', 'Update');
				this.getFAQsList();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
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

	onSort(event) {
		this.sortOption = {};
		this.sortOption[event.sorts[0].prop] = event.sorts[0].dir;
		this.pageInfo.offset = 0;
		this.pageInfo.page = 0;
		this.getFAQsList();
	}

	changeStatus(status, id) {
		if (id) this.selectedItem.push(id);
		if (this.selectedItem && this.selectedItem.length) {
			this.faqService
				.deleteFAQ({
					ids: this.selectedItem,
					status: status
				})
				.subscribe(
					(res: any) => {
						if (res && res.success) {
							this.toastrService.success(res.message);
							this.selectedItem = [];
							this.getFAQsList();
						}
					},
					(error) => {
						this.toastrService.error(error.message);
					}
				);
		} else {
			this.toastrService.error('Please select atleast one FAQ.');
		}
	}

	delete() {
		if (this.selectedItem && this.selectedItem.length) {
			const initialState = {
				title: 'Delete FAQ',
				message: `Are you sure, you want to Delete <b>${this.selectedItem}</b> FAQ?`
			};
			this.bsModalRef = this.modalService.show(ConfirmModalComponent, {
				initialState,
				class: 'custom-modal',
				backdrop: false
			});
			this.bsModalRef.content.response.subscribe((res: boolean) => {
				if (res) {
					this.faqService
						.deleteFAQ({
							ids: this.selectedItem,
							status: 'Delete'
						})
						.subscribe(
							(delRes: any) => {
								if (delRes.success) {
									this.commonService.showSuccess('', 'FAQ deleted successfully.');
									this.getFAQsList();
								}
							},
							(err) => {
								this.commonService.showError('', 'There is some problem on Deleting FAQ.');
							}
						);
				}
				this.bsModalRef.hide();
			});
		} else {
			this.toastrService.error('Please select atleast one FAQ.');
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
		this.getFAQsList();
	}

	ngOnDestroy() {
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}
}
