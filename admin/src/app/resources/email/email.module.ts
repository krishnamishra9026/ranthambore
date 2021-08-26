import { NgModule } from '@angular/core';

import { EmailRoutingModule } from './email-routing.module';
import { EmailService } from './email.service';
import { ListComponent } from './list/list.component';
import { ManageComponent } from './manage/manage.component';
import { SharedModule } from 'src/app/_shared/shared.module';

@NgModule({
	imports: [ SharedModule, EmailRoutingModule ],
	declarations: [ ListComponent, ManageComponent ],
	providers: [ EmailService ],
	entryComponents: [ ManageComponent ]
})
export class EmailModule {}
