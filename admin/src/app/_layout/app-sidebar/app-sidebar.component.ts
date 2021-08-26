import { Component, OnInit } from '@angular/core';

import { UserService, CommonService } from 'src/app/_services';

@Component({
	selector: 'app-sidebar',
	templateUrl: './app-sidebar.component.html',
	styleUrls: [ './app-sidebar.component.scss' ]
})
export class AppSidebarComponent implements OnInit {
	menu: { isMini: boolean } = { isMini: false };
	isSubmenuActive = false;
	rmenu = false;
	userType = '';

	constructor(private commonService: CommonService, private userService: UserService) {}

	ngOnInit() {
		this.menu = this.commonService.menu;
		//this.userType = this.userService.getUserInfo().type.toLocaleLowerCase();
	}
}
