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
  public zoom: number = 12;  
  public title: string = "";
  
  constructor(public appService:AppService, private propertyService: PropertyService, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {   
      this.getPropertyById(params['id']);
    })
  }
  
  public getPropertyById(propertyId){
    var _userId=this.propertyService.getUserId();
    this.appService.getPropertyById(_userId,propertyId).subscribe(data=> {
      this.title = data["title"];
      const location = data["location"]; 
      this.appService.getLatLng(location).subscribe(data => {
        console.log(data["results"][0]["geometry"]["location"]);
        const loc = data["results"][0]["geometry"]["location"];
        this.lat = loc.lat;
        this.lng = loc.lng;
      });
    }); 
  }
}
