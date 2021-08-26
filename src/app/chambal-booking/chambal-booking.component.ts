import {  OnInit} from '@angular/core';
import {  Component,  NgZone} from '@angular/core';
import {  NgForm} from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  Router, ActivatedRoute} from "@angular/router";

declare var Razorpay: any; 
import {  PostdataService} from "../postdata.service";
import {  FormBuilder,  FormGroup,  Validators,  FormArray,  FormControl } from '@angular/forms';

@Component({
  selector: 'app-chambal-booking',
  templateUrl: './chambal-booking.component.html',
  styleUrls: ['./chambal-booking.component.css']
})

export class ChambalBookingComponent implements OnInit {


title = 'Ranthambore Tiger Reserve';
   postsArray: any = [];

  CustomerDetailsForm: FormGroup;
  newdate: string;
  booking_name: string;
  booking_option: string;
  amount_to_paid: number = 0;
  id: number = 0;
  showForm:boolean = true;
  submitted = false;
  dataAvilability: number = 0;
  data: any = {};
  nCnt: number = 0;
  price: number = 0;
  price1: number = 0;
  price2: number = 0;
  price3: number = 0;
  price4: number = 0;
  price5: number = 0;
  no_persons: number = 0;
  no_persons_price: number = 0;
  pickup_drop: number = 0;
  gst: number = 0;
  count: number = 0;

  constructor(private fb: FormBuilder, private ngZone: NgZone, private contactService: PostdataService, private router: Router, private activatedRoute: ActivatedRoute,) { }

 valueee = '';
  ngOnInit() {


    this.activatedRoute.params.subscribe(params => {
          const id = +params.id;
          if (id && id > 0) {
            this.id= id;
          }

          switch (this.id) {
            case 1:
            this.booking_name = 'Chambal safari booking';
            this.booking_option = 'Cambal Safari Option 1';
            break;
            case 2:
            this.booking_name = 'Chambal Safari Booking with Pickup and Drop from Resort';
            this.booking_option = 'Cambal Safari Option 2';
            break;
            case 3:
            this.booking_name = 'Chambal Safari Booking with Lunch';
            this.booking_option = 'Cambal Safari Option 3';
            break;
            case 4:
            this.booking_name = 'Chambal Safari Booking with Luch including Pickup and Drop from Resort';
            this.booking_option = 'Cambal Safari Option 4';
            break;
          }  

      });


    



    var dddd = this.contactService.getCambalBookingPrices({'name' : 'Indian Gypsy Price'}).subscribe((res: any) => {
      JSON.parse(res._body).booking_prices.forEach((eee: any) => {

        console.log(eee['price']);

        if(eee['name'] == 'Safari Per Person Price Indian'){
          this.price1= eee['price'];
          sessionStorage.setItem("safari_per_person_price_indian", eee['price']);
        }
        if(eee['name'] == 'Safari Per Person Price Foreigner'){
          this.price2= eee['price'];
          sessionStorage.setItem("safari_per_person_price_foreigner", eee['price']);
        }
        if(eee['name'] == 'Lunch Per Person Price'){
          this.price3= eee['price'];
          sessionStorage.setItem("lunch_per_person_price", eee['price']);
        }
        
        if(eee['name'] == 'Pickup Drop Per Jeep Price'){
          this.price4= eee['price'];
          sessionStorage.setItem("pickup_drop_per_jeep_price", eee['price']);
        }

        if(eee['name'] == 'Pickup Drop Per Canter Price'){
          this.price5= eee['price'];
          sessionStorage.setItem("pickup_drop_per_canter_price", eee['price']);
        }

        var tt = eee['name'];
        var kk = eee['price'];
        this.postsArray.push(kk);
        switch (this.id) {
          case 1:
          this.nCnt = this.price1;
          break;
          case 2:
          this.nCnt = this.price5;
          break;
          case 3:
          this.nCnt = this.price3;
          break;
          case 4:
          this.nCnt = this.price3;
          break;
        }  
      });
   });

   

    this.CustomerDetailsForm = this.fb.group({
      id: this.id,
      name: [],
      mobile: [],
      email: [],
      id_proof_no: [],
      no_of_persons_indian: [],
      no_of_persons_foreigner: [],
      address: [],
      safari_date: [],
      safari_time: [],
      // date: this.date_val,
      amount: [],
      // vehicle: this.vehicle_val,
      // timing: this.timing_val,
    })
    this.onChanges();
  }


  get f() {
    return this.CustomerDetailsForm.controls;
  }


  refresh(): void {
    window.location.reload();
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
    this.CustomerDetailsForm.value.amount = this.nCnt;
    this.CustomerDetailsForm.value.transaction_id = '';
    this.contactService.createChambalDetails(this.CustomerDetailsForm.value);             

    var percent = 3;
    var number = (this.nCnt);
    var amount_total = number + ((percent / 100) * number);
    this.CustomerDetailsForm.value.amount = this.nCnt;
    var obj = this;
    var transaction_id = '';
    var options = {
      "key": "rzp_test_FvMwf7j3FOOnh8",
      "amount": amount_total * 100, 
      "name": "Ranthambore Jungle Safari",
      "description": "Ranthambore Jungle Safari Pay for Booking",
      "image": "https://ranthamboretigerreserve.in/assets/image/logo.png", 
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
      obj.contactService.createChambalDetails(obj.CustomerDetailsForm.value);
      alert(resp.error.description);
      this.refresh();
      return false;
      this.ngZone.run(() => this.router.navigateByUrl('/thank-you'));
    });

  }

  paymentResponseHander(response: any) {
    this.CustomerDetailsForm.value.transaction_id = response.razorpay_payment_id;
    this.contactService.createChambalDetails(this.CustomerDetailsForm.value);
    this.ngZone.run(() => this.router.navigateByUrl('/thank-you'));
  }

  onChanges(): void {

    var total_persons = 0;
    this.CustomerDetailsForm.valueChanges.subscribe(val => {

      var indian_persons = val.no_of_persons_indian;

      var foreigner_persons = val.no_of_persons_foreigner;

      total_persons = (val.no_of_persons_indian)+(val.no_of_persons_foreigner);

      var safari_per_person_price_indian = parseInt(sessionStorage.getItem('safari_per_person_price_indian'));
      var safari_per_person_price_foreigner = parseInt(sessionStorage.getItem('safari_per_person_price_foreigner'));
      var lunch_per_person_price = parseInt(sessionStorage.getItem('lunch_per_person_price'));
      var pickup_drop_per_jeep_price = parseInt(sessionStorage.getItem('pickup_drop_per_jeep_price'));
      var pickup_drop_per_canter_price = parseInt(sessionStorage.getItem('pickup_drop_per_canter_price'));

      if(this.id == 2){

        if(total_persons <= 6){
          var text = pickup_drop_per_jeep_price;
        }else if( (total_persons <= 12) && (total_persons >= 7)){
          var text = 2*pickup_drop_per_jeep_price;
        }else if(total_persons > 12){
          var text = pickup_drop_per_canter_price*total_persons;
        }

      }else if(this.id == 1){
        var text = ((safari_per_person_price_indian*indian_persons) + (safari_per_person_price_foreigner*foreigner_persons));
      }else if(this.id == 3 || this.id == 4){
        var text = (lunch_per_person_price*total_persons);
      }


      var amount_booking = 0;
      amount_booking = text;

      var gst = (amount_booking*5)/100;
      this.nCnt = amount_booking+gst;
      this.no_persons = total_persons;
      this.no_persons_price = amount_booking+gst;
      this.pickup_drop = amount_booking;
      this.gst = gst;

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
