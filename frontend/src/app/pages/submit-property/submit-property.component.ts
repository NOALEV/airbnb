/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { MapsAPILoader } from '@agm/core';
import { PropertyService } from 'src/app/property.service';
import { Router } from '@angular/router';
import { Apartment } from 'src/app/models/apartment.model';
import { HttpResponse } from '@angular/common/http';
import { HChartsSettings, ChartType } from 'src/app/shared/chart/chart.component.interface';
import { Property } from '../../app.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submit-property',
  templateUrl: './submit-property.component.html',
  styleUrls: ['./submit-property.component.scss']
})
export class SubmitPropertyComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper; 
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  public submitForm:FormGroup; 
  public features = [];
  public propertyTypes = [];
  public bedTypes = [];
  public cancellationPolicyes = [];
  public propertyStatuses = [];
  public cities = [];
  public neighborhoods = [];
  public streets = [];
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 12;  
  public chartsSettings: HChartsSettings;
  public airbnbProperties: Property[];
  public chartRadios: [ChartType.Lines, ChartType.Pie, ChartType.Doughnut, ChartType.Bars];

  constructor(public appService:AppService, 
              private fb: FormBuilder, 
              private mapsAPILoader: MapsAPILoader, 
              private ngZone: NgZone,
              private propertyService: PropertyService, private router: Router) { }
              

  ngOnInit() {
    this.features = this.appService.getFeatures();  
    this.propertyTypes = this.appService.getPropertyTypes();
    this.bedTypes = this.appService.getBedTypes();
    this.cancellationPolicyes = this.appService.getcancellationPolicy();
    this.propertyStatuses = this.appService.getPropertyStatuses();
    this.neighborhoods=this.appService.getNeighborhoods();
      

    this.submitForm = this.fb.group({
      basic: this.fb.group({
        title: [null, Validators.required],
        desc: null,
        cancellationPolicy: '',
        propertyType: [null, Validators.required],
        gallery: null
      }),
      address: this.fb.group({
        location: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: '',
        neighborhood: ['', Validators.required],
        street: '',
        lat: '',
        lng:''
      }),
      additional: this.fb.group({
        bedrooms: '',
        bathrooms: '',
        bedType: '',
        accommodates: '',
        features: this.buildFeatures()
      }),
 
    }); 

    this.setCurrentPosition();
    this.placesAutocomplete();
  }


  public onSelectionChange(e:any){ 
    if(e.selectedIndex == 4){   
      this.horizontalStepper._steps.forEach(step => step.editable = false);
    }
  }
  

  public reset(){
    this.horizontalStepper.reset(); 

   
    
    this.submitForm.reset({
      additional: {
        features: this.features
      },
      media:{ 
        featured: false
      }
    });   
     
  }

  // -------------------- Address ---------------------------  
  public onSelectCity(){
    this.submitForm.controls.address.get('neighborhood').setValue(null, {emitEvent: false});
    this.submitForm.controls.address.get('street').setValue(null, {emitEvent: false});
  }
  public onSelectNeighborhood(){
    this.submitForm.controls.address.get('street').setValue(null, {emitEvent: false}); 
  }

  private setCurrentPosition() {
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => { 
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude; 
      });
    }
  }
  private placesAutocomplete(){  
   
    this.mapsAPILoader.load().then(() => { 
      var cityBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(52.327157, 13.781318),
        new google.maps.LatLng(52.684707, 13.066864)
        );
      let autocomplete = new google.maps.places.Autocomplete(this.addressAutocomplete.nativeElement, {
       
        bounds: cityBounds,
        types: ["address"],
        strictBounds: false,
        componentRestrictions: {
          country: "DE",
        }
      });  
      autocomplete.addListener("place_changed", () => { 
        this.ngZone.run(() => { 
         
          let place: google.maps.places.PlaceResult = autocomplete.getPlace(); 
          if (place.geometry === undefined || place.geometry === null) {
            return;
          };

          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng(); 
          this.getAddress();
        });
      });
    });
  } 
  
 
  public getAddress(){    
    this.appService.getAddress(this.lat, this.lng).subscribe(response => {  
      
      if(response['results'].length){
        let address = response['results'][0].formatted_address; 
        this.submitForm.controls.address.get('location').setValue(address); 
        this.setAddresses(response['results'][0]); 
      } 
    })
  }
  public onMapClick(e:any){
    this.lat = e.coords.lat;
    this.lng = e.coords.lng; 
    this.getAddress();
  }
  public onMarkerClick(e:any){
    console.log(e);
  }
  
  public setAddresses(result){
    this.submitForm.controls.address.get('city').setValue(null);
    this.submitForm.controls.address.get('zipCode').setValue(null);
    this.submitForm.controls.address.get('street').setValue(null); 

    var newCity, newStreet, newNeighborhood;
    
    result.address_components.forEach(item =>{
      if(item.types.indexOf('locality') > -1){  
        if(this.cities.filter(city => city.name == item.long_name)[0]){
          newCity = this.cities.filter(city => city.name == item.long_name)[0];
        }
        else{
          newCity = { id: this.cities.length+1, name: item.long_name };
          this.cities.push(newCity); 
        }
        this.submitForm.controls.address.get('city').setValue(newCity);    
      }
      if(item.types.indexOf('postal_code') > -1){ 
        this.submitForm.controls.address.get('zipCode').setValue(item.long_name);
      }
    });

    if(!newCity){
      result.address_components.forEach(item =>{
        if(item.types.indexOf('administrative_area_level_1') > -1){  
          if(this.cities.filter(city => city.name == item.long_name)[0]){
            newCity = this.cities.filter(city => city.name == item.long_name)[0];
          }
          else{
            newCity = { 
              id: this.cities.length+1, 
              name: item.long_name 
            };
            this.cities.push(newCity); 
          }
          this.submitForm.controls.address.get('city').setValue(newCity);    
        } 
      });
    }

    if(newCity){
      result.address_components.forEach(item =>{ 
        if(item.types.indexOf('neighborhood') > -1){ 
          let neighborhood = this.neighborhoods.filter(n => n.name == item.long_name && n.cityId == newCity.id)[0];
          if(neighborhood){
            newNeighborhood = neighborhood;
          }
          else{
            newNeighborhood = { 
              id: this.neighborhoods.length+1, 
              name: item.long_name, 
              cityId: newCity.id 
            };
            this.neighborhoods.push(newNeighborhood);
          }
          this.neighborhoods = [...this.neighborhoods];
          this.submitForm.controls.address.get('neighborhood').setValue([newNeighborhood]); 
        }  
      })
    }

    if(newCity){
      result.address_components.forEach(item =>{            
        if(item.types.indexOf('route') > -1){ 
          if(this.streets.filter(street => street.name == item.long_name && street.cityId == newCity.id)[0]){
            newStreet = this.streets.filter(street => street.name == item.long_name && street.cityId == newCity.id)[0];
          }
          else{
            newStreet = { 
              id: this.streets.length+1, 
              name: item.long_name, 
              cityId: newCity.id, 
              neighborhoodId: (newNeighborhood) ? newNeighborhood.id : null 
            };
            this.streets.push(newStreet);
          }          
          this.streets = [...this.streets];
          this.submitForm.controls.address.get('street').setValue([newStreet]); 
        }
      })
    }
    this.submitForm.controls.address.get('lat').setValue(this.lat); 
    this.submitForm.controls.address.get('lng').setValue(this.lng); 
  }



   
  // -------------------- Additional ---------------------------  
  public buildFeatures() {
    const arr = this.features.map(feature => { 
      return this.fb.group({
        id: feature.id,
        name: feature.name,
        selected: feature.selected
      });
    })   
    return this.fb.array(arr);
  }
  

  
 


  public createFeature(): FormGroup {
    return this.fb.group({
      id: null,
      name: null, 
      value: null 
    });
  }
  public addFeature(): void {
    const features = this.submitForm.controls.media.get('additionalFeatures') as FormArray;
    features.push(this.createFeature());
  }
  public deleteFeature(index) {
    const features = this.submitForm.controls.media.get('additionalFeatures') as FormArray;
    features.removeAt(index);
  } 
  onProperryFormSubmit(values:Object):void
  {
   if (this.submitForm.valid) {
    this.setAirbnbProperties(values);
      this.propertyService.createProperty(values).subscribe((res: HttpResponse<any>) => {
      });

    }
  
}
// Airbnbn properties
private getPriceAsNumber(price: string) {
  price = price.replace("$", "");
  return Number(price)
}

setChartData(datasets: Chart.ChartDataSets[]) {
  this.chartsSettings = {
      chartType: ChartType.Lines,
      isShowLegend: true,
      labels: ['daily price', 'weekly price', 'monthly price'],
      datasets: datasets
  } as HChartsSettings;
}

public setAirbnbProperties(values: any) {
  this.airbnbProperties = [];
  this.appService.getAirbnbPropertiesByParams(values.basic.propertyType.name, values.additional.bedrooms).subscribe(data => {

      var airbnbProperties = data as any[];
      var dataSet: Chart.ChartDataSets[] = [];
      for (var entity of airbnbProperties) {
          var chartData: Chart.ChartDataSets = { data: [this.getPriceAsNumber(entity.price), this.getPriceAsNumber(entity.weekly_price), this.getPriceAsNumber(entity.monthly_price)], label: entity.name };
          airbnbProperties
          dataSet.push(chartData);
          this.airbnbProperties.push(this.convertAirbnbToPropertyObject(entity))
      }
      this.setChartData(dataSet);
  });
}

public convertAirbnbToPropertyObject(entity: any) {
  var prop: Property = {
    fromKaggle:true,
    id: entity.id,
    title: entity.name,
    desc: entity.description,
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
  } as unknown as Property

  return prop;
}

}








  
   
 
