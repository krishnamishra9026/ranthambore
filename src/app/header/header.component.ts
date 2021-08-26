import { Component, OnInit  ,Input} from '@angular/core';
import {  PostdataService} from "../postdata.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	title = 'jimcorbettparkonline';


  constructor(private contactService: PostdataService) { }
  ngOnInit() {
  
  }
}
