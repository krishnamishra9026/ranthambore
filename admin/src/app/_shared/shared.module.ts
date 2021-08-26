import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClickOutsideModule } from 'ng4-click-outside';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
//import { TooltipModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { TimeAgoPipe } from 'time-ago-pipe';

import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from 'ng2-ckeditor';
import { SharedService } from './shared.service';
import { NumberOnlyDirective } from './number-only.directive';

@NgModule({
	declarations: [ ConfirmModalComponent, TimeAgoPipe, NumberOnlyDirective ],
	imports: [
		TabsModule.forRoot(),
		BsDatepickerModule.forRoot(),
		BsDropdownModule.forRoot(),
		ProgressbarModule.forRoot(),
		ModalModule.forRoot(),
		TooltipModule.forRoot(),
		AlertModule.forRoot(),
		UiSwitchModule,
		NgSelectModule,
		NgxDatatableModule,
		CKEditorModule
	],
	exports: [
		ReactiveFormsModule,
		TabsModule,
		BsDatepickerModule,
		PerfectScrollbarModule,
		BsDropdownModule,
		ProgressbarModule,
		ModalModule,
		TooltipModule,
		AlertModule,
		UiSwitchModule,
		TimeAgoPipe,
		NgSelectModule,
		NgxDatatableModule,
		CKEditorModule,
		NumberOnlyDirective,
		ClickOutsideModule
	],
	entryComponents: [ ConfirmModalComponent ]
})
export class SharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SharedModule,
			providers: [ SharedService ]
		};
	}
}
