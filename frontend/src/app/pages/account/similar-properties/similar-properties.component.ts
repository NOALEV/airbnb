import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { PropertyService } from 'src/app/property.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-similar-properties',
  templateUrl: './similar-properties.component.html',
  styleUrls: ['./similar-properties.component.scss']
})
export class SimilarPropertiesComponent implements OnInit {

  public airbnbProperties: Property[];
  public message:string; 
  constructor(public appService: AppService, private propertyService: PropertyService, private activatedRoute:ActivatedRoute) { }
  
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

  public setAirbnbProperties(values: any) {
    this.airbnbProperties = [];
    this.appService.getAirbnbPropertiesByParams(values.propertyType, values.bedrooms).subscribe(data => {
  
        var airbnbProperties = data as any[];
        for (var entity of airbnbProperties) {
            this.airbnbProperties.push(this.convertAirbnbToPropertyObject(entity))
        }
        if(this.airbnbProperties.length == 0){
       
         
          this.message = 'No Results Found';
          return false;
        } 
    });
  }
 
  public convertAirbnbToPropertyObject(entity: any) {
    var prop: Property = {
      fromKaggle:true,
      id: entity.id,
      title: entity.name,
      desc: entity.description,
      priceForNight: entity.price,
      accommodates: entity.accommodates,
      propertyType: entity.property_type,
      bedType: entity.bed_type,
      area: {
        value: entity.square_feet, unit: "ft²"
      },
      ratingsCount: 7,
      ratingsValue: entity.review_scores_rating,
      city: entity.city,
      zipCode: [entity.zipcode],
      neighborhood: [entity.neighbourhood],
      street: entity.street,
      priceDollar: { rent: this.getPriceAsNumber(entity.price) },
      //location: Location,
      bedrooms: entity.bedrooms,
      bathrooms: entity.bathrooms,
      garages: 0,
      yearBuilt: 2018,
      images: [{ data: entity.picture_url }],
      lastUpdate: entity.calendar_updated,
      listingUrl:entity.listing_url
    } as unknown as Property
  
    return prop;
  }
  
  private getPriceAsNumber(price: string) {
    price = price.replace("$", "");
    return Number(price)
  }



}
