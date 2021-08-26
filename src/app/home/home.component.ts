import {  OnInit} from '@angular/core';
import {  Component,  NgZone} from '@angular/core';
import {  NgForm} from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  Router} from "@angular/router";

import {  PostdataService} from "../postdata.service";

import {  FormBuilder,  FormGroup,  Validators,  FormArray,  FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'Ranthambore Tiger Reserve';
  postsArray: any = [];
  newdate: string;
  amount_to_paid: number = 0;
  showForm:boolean = true;
  submitted = false;
  dataAvilability: number = 0;
  data: any = {};
  nCnt: number = this.amount_to_paid;
  count: number = 0;

  constructor(private fb: FormBuilder, private ngZone: NgZone, private contactService: PostdataService, private router: Router) {}


  ngOnInit() {

  }

  refresh(): void {
    window.location.reload();
  }

  doSomething(w){

  }
 
  OnUpdateDate(event: Event) {
    this.newdate = ( < HTMLInputElement > event.target).value;
  }

  onBlurMethod()
  {
    var inputmobilevalue = this.data.mobile;
    var inputnamevalue = this.data.name;
    if(inputnamevalue){
      if(inputmobilevalue.toString().length>=10){
        var send_data = {
          'name': inputnamevalue,
          'mobile': inputmobilevalue
        };
  
        this.contactService.sendEnquiry(send_data)
        .toPromise()
        .then(response => {
          console.log('mail sended');
       });
      }
    }
  }

  register() {
      var inputValue = ( < HTMLInputElement > document.getElementById('date')).value;
      this.data.date = inputValue;
      this.contactService.sendEnquiryDetails(this.data)
          .toPromise()
          .then((response: any) => {
              var element = document.getElementById("CloseButton") as any;
              element.click();
              this.ngZone.run(() => this.router.navigateByUrl('/thankyou'));

          });
  }
}