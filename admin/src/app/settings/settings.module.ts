import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsService } from './settings.service';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../_shared/shared.module';

@NgModule({
	imports: [ SharedModule, SettingsRoutingModule ],
	declarations: [ SettingsComponent ],
	providers: [ SettingsService ]
})
export class SettingsModule {}
