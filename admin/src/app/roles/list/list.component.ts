import { Component, OnInit } from '@angular/core';
import { Roles } from '../roles';
import { RolesService } from '../roles.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/_services';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ManageComponent } from '../manage/manage.component';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: [ './list.component.scss' ]
})
export class ListComponent implements OnInit {
	canUpdate: boolean;
	roles: Array<Roles> = [];
	bsModalRef: BsModalRef = new BsModalRef();
	dismissible = true;
	newDocModalRef: BsModalRef;

	constructor(
		private modalService: BsModalService,
		private rolesService: RolesService,
		private commonService: CommonService,
		private toastrService: ToastrService
	) {
		this.getRoles();
	}

	ngOnInit() {
		this.canUpdate = this.commonService.hasPermission('update_roles');
	}

	getRoles() {
		this.rolesService.getRoles().subscribe(
			(res: any) => {
				if (res && res.success) {
					this.roles = res.data;
				}
			},
			(error) => {
				this.toastrService.error(error.error.message);
			}
		);
	}
	update(id) {
		const initialState = {
			roleId: id
		};

		this.newDocModalRef = this.modalService.show(ManageComponent, {
			initialState,
			class: 'custom-modal',
			backdrop: false
		});
		this.newDocModalRef.content.response.subscribe((res: any) => {
			if (res && res.success) {
				this.toastrService.success('Roles udpated successfully', 'Update');
				this.getRoles();
			} else if (res) {
				this.commonService.showError('', res.message);
			}
			this.newDocModalRef.hide();
		});
	}

	refreshList() {
		this.getRoles();
	}
	ngOnDestroy() {
		this.bsModalRef ? this.bsModalRef.hide() : null;
		this.newDocModalRef ? this.newDocModalRef.hide() : null;
	}
}
