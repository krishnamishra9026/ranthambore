import {  OnInit} from '@angular/core';
import {  Component,  NgZone} from '@angular/core';
import {  NgForm} from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  Router} from "@angular/router";

declare var Razorpay: any; 
import {  PostdataService} from "../postdata.service";
import {  FormBuilder,  FormGroup,  Validators,  FormArray,  FormControl } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {


title = 'Ranthambore Tiger Reserve';
   postsArray: any = [];

    ind_gypsy_price: number = 0;
    forn_gypsy_price: number = 0;
    ind_canter_price: number = 0;
    forn_canter_price: number = 0;


   date_val = sessionStorage.getItem("date");
   zone_val =  sessionStorage.getItem("zone");
   vehicle_val = sessionStorage.getItem("vehicle");
   timing_val = sessionStorage.getItem("timing");


   showZone1:boolean = false;
   showZone2:boolean = false;
   showZone:boolean = false;

  CustomerDetailsForm: FormGroup;
  newdate: string;
  amount_to_paid: number = 0;
  showForm:boolean = true;
  submitted = false;
  dataAvilability: number = 0;
  data: any = {};
  nCnt: number = this.amount_to_paid;
  count: number = 0;




  constructor(private fb: FormBuilder, private ngZone: NgZone, private contactService: PostdataService, private router: Router) { }

 valueee = '';
  ngOnInit() {

  if(this.zone_val == 'Zone1'){
    this.showZone1 = true;
  }
  else if(this.zone_val == 'Zone2'){
    this.showZone2 = true;
  }else{
  this.showZone = true;
  }

    var dddd = this.contactService.getBookingPrice({'name' : 'Indian Gypsy Price'}).subscribe((res: any) => {
      JSON.parse(res._body).booking_prices.forEach((eee: any) => {

        if(eee['name'] == 'Foreigner Canter Price'){
          sessionStorage.setItem("forn_canter_price", eee['price']);
        }
        if(eee['name'] == 'Foreigner Gypsy Price'){
          sessionStorage.setItem("forn_gypsy_price", eee['price']);
        }
        if(eee['name'] == 'Indian Gypsy Price'){
          sessionStorage.setItem("ind_gypsy_price", eee['price']);
        }
        if(eee['name'] == 'Indian Canter Price'){
          sessionStorage.setItem("ind_canter_price", eee['price']);
        }
        var tt = eee['name'];
        var kk = eee['price'];
        this.postsArray.push(kk)
      });
   });
  

    this.CustomerDetailsForm = this.fb.group({
      name: [],
      mobile: [],
      email: [],
      address: [],
      date: this.date_val,
      zone: this.zone_val,
      amount: [],
      vehicle: this.vehicle_val,
      timing: this.timing_val,
      booked_persons: this.fb.array([this.fb.group({
        name: [],
        gender: '',
        nationality: '',
        id_proof: '',
        idnumber: '',
      })])
    })
    this.onChanges();
  }


  get f() {
    return this.CustomerDetailsForm.controls;
  }


  refresh(): void {
    window.location.reload();
  }
  

  get booked_persons() {
    return this.CustomerDetailsForm.get('booked_persons') as FormArray;
  }


  doSomething(w){

  }
 


  addBookingPerson() {
    var vehicle_type = sessionStorage.getItem("vehicle");
    if (vehicle_type == 'Canter') {
      if (this.count > 18) {
        return false;
      }
    }
    if (vehicle_type == 'Gypsy') {
      if (this.count > 4) {
        return false;
      }
    }


    this.count++;
    this.booked_persons.push(this.fb.group({
      name: '',
      gender: '',
      nationality: '',
      id_proof: '',
      idnumber: '',
    }));
  }

  deleteBookingPerson(index) {
    this.count--;
    if (index == 0) return;
    this.booked_persons.removeAt(index);
  }


  OnUpdateDate(event: Event) {
    this.newdate = ( < HTMLInputElement > event.target).value;
  }

  SaveData() {
   this.submitted = true;
   if (this.CustomerDetailsForm.invalid) {
   return;
   }

    var percent = 3;
    var number = (this.nCnt);
    var amount_total = number + ((percent / 100) * number);
    this.CustomerDetailsForm.value.date = sessionStorage.getItem("date");
    this.CustomerDetailsForm.value.zone = sessionStorage.getItem("zone");
    this.CustomerDetailsForm.value.vehicle = sessionStorage.getItem("vehicle");
    this.CustomerDetailsForm.value.timing = sessionStorage.getItem("timing");
    this.CustomerDetailsForm.value.amount = this.nCnt;
    this.CustomerDetailsForm.value.transaction_id = '';
    this.contactService.createContactDetails(this.CustomerDetailsForm.value);             

    var check_data = {
      'date': sessionStorage.getItem("date"),
      'zone': sessionStorage.getItem("zone"),
      'vehicle': sessionStorage.getItem("vehicle"),
      'timing': sessionStorage.getItem("timing")
  };
  
  this.contactService.checkAvilability(check_data)
      .toPromise()
      .then(response => {
          this.dataAvilability = parseInt(response.json().events.availability);

          if (this.dataAvilability < ((this.count)+1)) {

            var send_data = {
                  'name': this.CustomerDetailsForm.value.name,
                  'mobile': this.CustomerDetailsForm.value.mobile
              };
  
              this.contactService.sendEnquiry(send_data)
                  .toPromise()
                  .then(response => {
                      //console.log('mail sended');
                  });
                  alert('Avilability of seets is Only '+ this.dataAvilability +' !');
                  
              return;
          } else {
              var percent = 3;
              var number = (this.nCnt);
              var amount_total = number + ((percent / 100) * number);
              this.CustomerDetailsForm.value.date = sessionStorage.getItem("date");
              this.CustomerDetailsForm.value.zone = sessionStorage.getItem("zone");
              this.CustomerDetailsForm.value.vehicle = sessionStorage.getItem("vehicle");
              this.CustomerDetailsForm.value.timing = sessionStorage.getItem("timing");
              this.CustomerDetailsForm.value.amount = this.nCnt;
              var obj = this;
              var transaction_id = '';
              var options = {
                   //"key": "rzp_live_MaDPyLqwM5pEDM",
                   "key": "rzp_live_DVVSru9XQyBDm4",
                  //"key": "rzp_test_FvMwf7j3FOOnh8",
                 //"key_secret": 'vGHpxOQsTjDLdYsAiqYi0S5m',
                 "key_secret": 'dgKn3nlWQghoOoRkzV0xJ9Ik',
                 // "key_secret": 'akQIaCcuBrjFg5ryTgt1oYb6',
                  "amount": amount_total * 100, // Example: 2000 paise = INR 20
                  "name": "Ranthambore Jungle Safari",
                  "description": "Ranthambore Jungle Safari Pay for Booking",
                  "image": "https://ranthamboretigerreserve.in/assets/image/logo.png", // COMPANY LOGO
                  handler: this.paymentResponseHander.bind(this),
                  "modal": {
                      "ondismiss": function() {
                          return;
                          window.location.reload();
                      },
                  },
                  "prefill": {
                      "name": this.CustomerDetailsForm.value.name,
                      "email": this.CustomerDetailsForm.value.email,
                      "contact": this.CustomerDetailsForm.value.mobile,
                  },
                  "notes": {
                      "address": this.CustomerDetailsForm.value.address,
                  },
                  "theme": {
                      "color": "#F37254"
                  }
              };
  
              var propay = new Razorpay(options);
              propay.open();
  
              propay.on('payment.error', function(resp: any) {
                  obj.CustomerDetailsForm.value.transaction_id = '';
                  obj.contactService.createContactDetails(obj.CustomerDetailsForm.value);
                  alert(resp.error.description);
                  this.refresh();
                  return false;
                  this.ngZone.run(() => this.router.navigateByUrl('/thank-you'));
              });
  
          }
      });
  
  }

  paymentResponseHander(response: any) {
    this.CustomerDetailsForm.value.transaction_id = response.razorpay_payment_id;
    this.contactService.createContactDetails(this.CustomerDetailsForm.value);
    this.ngZone.run(() => this.router.navigateByUrl('/thank-you'));
  }

  onChanges(): void {

    this.CustomerDetailsForm.valueChanges.subscribe(val => {
      var amount_booking = 0;

      for (var i = 0; i < val.booked_persons.length; i++) {

        if (sessionStorage.getItem("vehicle") == 'Canter') {
          var ind_price =  parseInt(sessionStorage.getItem("ind_canter_price"));
          var forn_price = parseInt(sessionStorage.getItem("forn_canter_price"));
        } else {
          var ind_price =  parseInt(sessionStorage.getItem("ind_gypsy_price"));
          var forn_price = parseInt(sessionStorage.getItem("forn_gypsy_price"));
        }

        if (val.booked_persons[i]['nationality'] == 'Indian') {
          amount_booking = amount_booking + ind_price;
        } else
        if (val.booked_persons[i]['nationality'] == 'Foreigner') {
          amount_booking = amount_booking + forn_price;
        } else {
          amount_booking = amount_booking + 0;
        }
      }
      this.nCnt = amount_booking;


    });

    this.CustomerDetailsForm.get('mobile').valueChanges.subscribe(val1 => {
      
      if(val1){
        if((val1).toString().length>=10){
          var send_data = {
            'name': this.CustomerDetailsForm.value.name,
            'mobile': this.CustomerDetailsForm.value.mobile
          };
    
          this.contactService.sendEnquiry(send_data)
          .toPromise()
          .then(response => {
         });
        }
      }
    });

  }


}
