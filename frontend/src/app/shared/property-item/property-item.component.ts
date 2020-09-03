import { Component, OnInit, Input, ViewChild, SimpleChange } from '@angular/core';
import { SwiperDirective, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper'; 
import { Property } from '../../app.models';
import { Settings, AppSettings } from '../../app.settings';

import { AppService } from '../../app.service'; 
import { CompareOverviewComponent } from '../compare-overview/compare-overview.component'; 
import { PropertyService } from 'src/app/property.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-property-item',
  templateUrl: './property-item.component.html',
  styleUrls: ['./property-item.component.scss'] 
})
export class PropertyItemComponent implements OnInit {
  @Input() property: Property;
  @Input() type: string;
  @Input() viewType: string = "grid";
  @Input() viewColChanged: boolean = false; 
  @Input() fullWidthPage: boolean = true;   
  public column:number = 4;
  // public address:string; 
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  public settings: Settings;
  public currencies = ['USD', 'EUR'];
  public currency;
  constructor(public appSettings:AppSettings, public appService:AppService,              private propertyService: PropertyService,
    ) {
    this.settings = this.appSettings.settings;
  }
  public currentPropertyId: string;
  


  ngOnInit() {
    this.currency =this.currencies[0];
   }

  ngAfterViewInit(){
    this.initCarousel();
    // this.appService.getAddress(this.property.location.lat, this.property.location.lng).subscribe(data=>{
    //   console.log(data['results'][0]['formatted_address']);
    //   this.address = data['results'][0]['formatted_address'];
    // })
  } 
 
  ngOnChanges(changes: {[propKey: string]: SimpleChange}){  
    if(changes.viewColChanged){
      this.getColumnCount(changes.viewColChanged.currentValue);
      if(!changes.viewColChanged.isFirstChange()){
        if(this.property.gallery.length > 1){     
           this.directiveRef.update();  
        } 
      }
    } 

    for (let propName in changes) {      
      // let changedProp = changes[propName];
      // if (!changedProp.isFirstChange()) {
      //   if(this.property.gallery.length > 1){
      //     this.initCarousel();
      //     this.config.autoHeight = true;       
      //     this.directiveRef.update();  
      //   }       
      // }      
    }  
  }
  openWindow(property){
    window.open(property.listingUrl,"_blank")
    }
    
  public getColumnCount(value){
    if(value == 25){
      this.column = 4;
    }
    else if(value == 33.3){
      this.column = 3;
    }
    else if(value == 50){
      this.column = 2
    }
    else{
      this.column = 1;
    }
  }

  public getStatusBgColor(status){
    switch (status) {
      case 'For Sale':
        return '#558B2F';  
      case 'For Rent':
        return '#1E88E5'; 
      case 'Open House':
        return '#009688';
      case 'No Fees':
        return '#FFA000';
      case 'Hot Offer':
        return '#F44336';
      case 'Sold':
        return '#000';
      default: 
        return '#01579B';
    }
  }


  public initCarousel(){
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,         
      keyboard: false,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,        
      loop: true,
      preloadImages: false,
      lazy: true,  
      nested: true,
      // autoplay: {
      //   delay: 5000,
      //   disableOnInteraction: false
      // },
      speed: 500,
      effect: "slide"
    }
  }
  predictionButton():void
  {
    
     this.propertyService.prediction(this.property._id,this.property._userId).subscribe((res:any) => {
      this.currency =this.currencies[0];
      this.property.getPrediction=true;
      this.property.predictionUs=res.amount;
      this.property.prediction=res.amount;

      
      });

    }
    
    public changeCurrency(currency){
      
      var from =this.currency;
      var to= currency;

      if(to=="USD" && this.property.predictionUs){
        this.property.prediction =this.property.predictionUs;
        this.currency = currency;
      }else if(to=="EUR" ){
        if(this.property.predictionEur){
          this.property.prediction =this.property.predictionEur;
          this.currency = currency;
        }else{
          this.propertyService.convertCurrency(this.property.predictionUs,from,to).subscribe((res: any) => {
            this.property.predictionEur =res.amount;
            this.property.prediction=this.property.predictionEur;
            this.currency = currency;
          });
        }

      }
      
      
  
  
  
    } 
  


  public addToCompare(){
    this.appService.addToCompare(this.property, CompareOverviewComponent, (this.settings.rtl) ? 'rtl':'ltr'); 
  }

  public onCompare(){
    return this.appService.Data.compareList.filter(item=>item._id == this.property._id)[0];
  }

  public addToFavorites(){
    this.appService.addToFavorites(this.property, (this.settings.rtl) ? 'rtl':'ltr');
  }

  public onFavorites(){
    return this.appService.Data.favorites.filter(item=>item._id == this.property._id)[0];
  }


}
