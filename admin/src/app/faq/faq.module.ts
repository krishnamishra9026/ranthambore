import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
	declarations: [ ListComponent, ManageComponent ],
	imports: [ CommonModule, FaqRoutingModule, SharedModule ],
	entryComponents: [ ManageComponent ]
})
export class FaqModule {}
