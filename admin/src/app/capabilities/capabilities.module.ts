import { NgModule } from '@angular/core';

import { CapabilitiesRoutingModule } from './capabilities-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';

import { CapabilitiesService } from './capabilities.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
	imports: [ SharedModule, CapabilitiesRoutingModule, CommonModule ],
	declarations: [ ListComponent, ManageComponent ],
	providers: [ CapabilitiesService ],
	entryComponents: [ ManageComponent ]
})
export class CapabilitiesModule {}
