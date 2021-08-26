import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
	declarations: [ ListComponent, ManageComponent ],
	imports: [ SharedModule, CommonModule, EventsRoutingModule ],
	entryComponents: [ ManageComponent ]
})
export class EventsModule {}
