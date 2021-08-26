import { Injectable } from '@angular/core';
import { CustomerDetail } from './customer_detail';
import { Customer } from './customer';
import { Order } from './order';
import { Http, Response } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class PostdataService {

private contactsUrl = '/api/contacts';

  constructor(private http: Http) { }


  // post("/api/contacts")
  createContactDetails(newCustomerDetail: CustomerDetail): Promise<void | CustomerDetail> {
    return this.http.post('/saveCustomerDetails', newCustomerDetail)
               .toPromise()
               .then(response => response.json() as CustomerDetail)
               .catch(this.handleError);
  }


    createChambalDetails(newCustomerDetail: CustomerDetail): Promise<void | CustomerDetail> {
    return this.http.post('http://127.0.0.1:3000/saveChambalBookings', newCustomerDetail)
               .toPromise()
               .then(response => response.json() as CustomerDetail)
               .catch(this.handleError);
  }


  


   checkAvilability(CustomerDetail) {
    return this.http.post('/checkAvilability', CustomerDetail);
  }


   getBookingPrice(objdata){
    return this.http.get('/getBookingPrices', objdata);
  }

  getCambalBookingPrices(objdata){
    return this.http.get('http://127.0.0.1:3000/getCambalBookingPrices', objdata);
  }
  

   sendEnquiry(enquiryDetail) {
    return this.http.post('/sendEnquiryMail', enquiryDetail);
  }


    sendEnquiryDetails(enquiryDetails) {
    return this.http.post('/sendEnquiryDetailMail', enquiryDetails);
  } 

  


  createCustomer(newCustomer: Customer): Promise<void | Customer> {
    return this.http.post('/saveCustomer', newCustomer)
               .toPromise()
               .then(response => response.json() as Customer)
               .catch(this.handleError);
  }


  createOrder(newOrder: Order): Promise<void | Order> {
    return this.http.post('/saveOrder', newOrder)
               .toPromise()
               .then(response => response.json() as Order)
               .catch(this.handleError);
  }

   private extractData(res: Response) {
        let body = res.json().booking_prices;
       // console.log(res.json().booking_prices);
        return body || {};
    }

  private handleError (error: any) {
  let errMsg = (error.message) ? error.message :
  error.status ? `${error.status} - ${error.statusText}` : 'Server error';
  console.log(errMsg); // log to console instead
}	

}
