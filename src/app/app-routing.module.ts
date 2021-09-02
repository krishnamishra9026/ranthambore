import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { SuccessComponent } from './success/success.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { ChambalBookingComponent } from './chambal-booking/chambal-booking.component';
import { SafariComponent } from './safari/safari.component';
import { CambalSafariBookingComponent } from './cambal-safari-booking/cambal-safari-booking.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { TermsAndConditionComponent } from './terms-and-condition/terms-and-condition.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';

const routes: Routes = [
   { path: '', component: HomeComponent },
   { path: 'gotohome',   redirectTo: '', pathMatch: 'full' },
   { path: 'thank-you', component: ThankYouComponent },
   { path: 'thankyou', component: SuccessComponent },
   { path: 'booking', component: BookingComponent },
   { path: 'chambal-booking/:id', component: ChambalBookingComponent },
   { path: 'cambal-safari', component: CambalSafariBookingComponent },
   { path: 'safari', component: SafariComponent },
   { path: 'about-us', component: AboutusComponent },
   { path: 'contact-us', component: ContactusComponent },
   { path: 'terms-and-condition', component: TermsAndConditionComponent },
   { path: 'privacy-policy', component: PrivacyPolicyComponent },
   { path: 'cancellation-policy', component: CancellationPolicyComponent },
  { path: '**', component: PageNotFoundComponent }
];

// { enableTracing: true } 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
