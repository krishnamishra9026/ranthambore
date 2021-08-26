import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/_services';

@Component({
	selector: 'app-app-layout',
	templateUrl: './app-layout.component.html',
	styleUrls: [ './app-layout.component.scss' ]
})
export class AppLayoutComponent implements OnInit {
	menu: { isMini: boolean } = { isMini: false };
	constructor(private commonService: CommonService) {}

	ngOnInit() {
		this.menu = this.commonService.menu;
	}
}
