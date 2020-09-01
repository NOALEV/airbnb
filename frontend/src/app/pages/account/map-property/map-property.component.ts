import { Component, OnInit } from '@angular/core';
import { PropertyService } from 'src/app/property.service';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { Property } from 'src/app/app.models';

@Component({
  selector: 'app-map-property',
  templateUrl: './map-property.component.html',
  styleUrls: ['./map-property.component.scss']
})
export class MapPropertyComponent implements OnInit {

  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 16;  
  public title: string = "";
  public markers = [];
  public myProperty:object;
  public image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

  
  constructor(public appService:AppService, private propertyService: PropertyService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {   
      this.getPropertyById(params['id']);
    })
  }
  
  

  public getPropertyById(propertyId){
    var _userId=this.propertyService.getUserId();
    this.appService.getPropertyById(_userId,propertyId).subscribe(data=> {
      this.setAirbnbProperties(data);
      this.myProperty= data;
    }); 
  }

 /* public setAirbnbProperties(value: any) {
    this.appService.getAirbnbPropertiesByNeighbourhood(value.neighborhood).subscribe(data => {
    this.title = `Properties in ${value.neighborhood}`;
    this.lat = data[0].latitude; 
    this.lng = data[0].longitude;

    this.markers = (<any[]>data).map((item) => { 
      return {"lat": item.latitude, "lng":item.longitude}
    });
        
    });
  
  }
*/
openWindow(marker){
window.open(marker.url,"_blank")
}

  public setAirbnbProperties(value: any) {
    this.appService.getAirbnbPropertiesByLatAndLng(value.lat,value.lng).subscribe(data => {
    this.title = `Properties near me`;
    this.lat = data[0].latitude; 
    this.lng = data[0].longitude;

    this.markers = (<any[]>data).map((item) => { 

      return {"lat": item.latitude, "lng":item.longitude,"name":item.name, "url":item.listing_url}
    });
        
    });
  
  }






}
