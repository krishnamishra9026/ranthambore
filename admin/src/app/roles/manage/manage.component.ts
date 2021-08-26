import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Capability } from '../capability';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/_shared/shared.service';
import { RolesService } from '../roles.service';
import { CommonService } from 'src/app/_services';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit {
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	roleId: string;
	roleDetail: { id: string; name: string; capabilities: Array<string> } = {
		id: null,
		name: null,
		capabilities: []
	};
	moduleWiseCapabilities: Array<Capability> = [];

	constructor(
		private toastrService: ToastrService,
		private sharedService: SharedService,
		private rolesService: RolesService,
		private commonService: CommonService
	) {}

	ngOnInit() {
		this.getCapabilities();
		this.getRoleDetails();
	}

	capabilityChange(slug) {
		const currentSlugIndex = this.roleDetail.capabilities.indexOf(slug);

		if (currentSlugIndex > -1) {
			this.roleDetail.capabilities.splice(currentSlugIndex, 1);
		} else {
			this.roleDetail.capabilities.push(slug);
		}
	}

	assignCapabilities() {
		this.rolesService
			.assignCapabilitiesToRole(this.roleId, {
				capabilities: this.roleDetail.capabilities
			})
			.subscribe(
				(res: any) => {
					if (res && res.success) {
						this.toastrService.success(res.message);
						this.response.emit(res);
					} else {
						this.toastrService.error(res.message);
					}
				},
				(err) => {
					this.toastrService.error(err.message);
				}
			);
	}

	private getRoleDetails() {
		this.rolesService.getRoleDetail(this.roleId).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.roleDetail = res.data;
				} else {
					this.toastrService.error(res.message);
				}
			},
			(err) => {
				this.toastrService.error(err.message);
			}
		);
	}

	private getCapabilities() {
		this.sharedService.getAllCapabilities().subscribe(
			(res: any) => {
				if (res && res.success && res.data) {
					this.moduleWiseCapabilities = res.data;
				} else {
					this.toastrService.error(res.message);
				}
			},
			(err) => {
				this.toastrService.error(err.message);
			}
		);
	}
	close() {
		this.response.emit();
	}
}
