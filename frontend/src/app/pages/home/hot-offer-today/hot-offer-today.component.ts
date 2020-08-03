import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { PropertyService } from 'src/app/property.service';

@Component({
  selector: 'app-hot-offer-today',
  templateUrl: './hot-offer-today.component.html',
  styleUrls: ['./hot-offer-today.component.scss']
})
export class HotOfferTodayComponent implements OnInit {
  @Input('propertyId') propertyId;
  public property;
  constructor(public appService:AppService,
    private propertyService: PropertyService,
    ) { }

  ngOnInit() {
    var _userId=this.propertyService.getUserId();

    this.appService.getPropertyById(_userId,this.propertyId).subscribe(property=>{
      this.property = property;
    }) 
  }

}
