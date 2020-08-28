import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from '../../../app.settings';
import { PropertyService } from 'src/app/property.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {
  public currencies = ['USD', 'EUR'];
  public currency:any; 
  public settings: Settings;
  constructor(public appSettings:AppSettings, private propertyService: PropertyService,) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.currency = this.settings.currency;
  }
  
  public changeCurrency(currency){
    var amount =100;
    var from =this.currency;
    var to= currency;
    this.propertyService.convertCurrency(amount,from,to).subscribe((res: HttpResponse<any>) => {
      console.log(res.body);
    });
    this.currency = currency;
    this.settings.currency = currency;



  } 

}
