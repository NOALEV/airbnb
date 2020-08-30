import { Component, OnInit } from '@angular/core';
import { PropertyService } from 'src/app/property.service';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';

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
    }); 
  }

  public setAirbnbProperties(value: any) {
    this.appService.getAirbnbPropertiesByNeighbourhood(value.neighborhood).subscribe(data => {
    this.title = `Properties in ${value.neighborhood}`;
    this.lat = data[0].latitude; 
    this.lng = data[0].longitude;
    this.markers = (<any[]>data).map((item) => { 
      return {"lat": item.latitude, "lng":item.longitude}
    });
        
    });
  
  }






}
