import { Component, OnInit } from '@angular/core';

import {  PostdataService} from "../postdata.service";

@Component({
  selector: 'app-cambal-safari-booking',
  templateUrl: './cambal-safari-booking.component.html',
  styleUrls: ['./cambal-safari-booking.component.css']
})
export class CambalSafariBookingComponent implements OnInit {


  price1: number = 0;
  price2: number = 0;
  price3: number = 0;
  price4: number = 0;
  price5: number = 0;


  constructor(private contactService: PostdataService) { }

  ngOnInit() {


    var dddd = this.contactService.getCambalBookingPrices({'name' : 'Indian Gypsy Price'}).subscribe((res: any) => {
      JSON.parse(res._body).booking_prices.forEach((eee: any) => {

        if(eee['name'] == 'Safari Per Person Price Indian'){
          this.price1= eee['price'];
        }
        if(eee['name'] == 'Safari Per Person Price Foreigner'){
          this.price2= eee['price'];
        }
        if(eee['name'] == 'Lunch Per Person Price'){
          this.price3= eee['price'];
        }        
        if(eee['name'] == 'Pickup Drop Per Jeep Price'){
          this.price4= eee['price'];
        }
        if(eee['name'] == 'Pickup Drop Per Canter Price'){
          this.price5= eee['price'];
        }
      });
    });

  }

}
