import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/_services';

@Component({
	selector: 'site-header',
	templateUrl: './site-header.component.html',
	styleUrls: [ './site-header.component.scss' ]
})
export class SiteHeaderComponent implements OnInit {
	constructor(private router: Router, private commonService: CommonService) {}

	ngOnInit() {}
	login() {
		this.router.navigate([ '/login' ]);
	}
	gotoHome() {
		this.commonService.navigateTo('');
	}
}
