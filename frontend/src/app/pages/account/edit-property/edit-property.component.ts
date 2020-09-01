import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Property } from 'src/app/app.models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PropertyService } from 'src/app/property.service';
import { HttpResponse } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router'; 


@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss']
})
export class EditPropertyComponent implements OnInit {
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  private sub: any;
  public property:Property;
  public submitForm:FormGroup;
  public features = [];
  public propertyTypes = [];
  public bedTypes = [];
  public roomTypes = [];

  public cancellationPolicyes = [];


  public propertyStatuses = [];
  public cities = [];
  public neighborhoods = [];
  public streets = [];
  public lat: number ;
  public lng: number ;
  public zoom: number = 12; 
  public currentPropertyId: string;
  constructor(public appService:AppService, 
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private mapsAPILoader: MapsAPILoader, 
              private ngZone: NgZone,
              private propertyService: PropertyService,
              public router:Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.features = this.appService.getFeatures();
    this.propertyTypes = this.appService.getPropertyTypes();
    this.bedTypes = this.appService.getBedTypes();
    this.cancellationPolicyes = this.appService.getcancellationPolicy();
    this.propertyStatuses = this.appService.getPropertyStatuses();
    this.neighborhoods=this.appService.getNeighborhoods();
    this.roomTypes=this.appService.getRoomTypes();
      
    this.submitForm = this.fb.group({
      basic: this.fb.group({
        title: [null, Validators.required],
        desc: null,
        propertyType: [null, Validators.required],
        roomType: [null, Validators.required],

        cancellationPolicy:'',
        gallery: null
      }),
      address: this.fb.group({
        location: '',
        city: '',
        zipCode: '',
        neighborhood:'',
        street: '',
        lat: '',
        lng:''
      }),
      additional: this.fb.group({
        bedrooms: '',
        bathrooms: '',
        bedType: '',
        accommodates: null,
        features: this.buildFeatures()
      }),
   
    }); 
    this.setCurrentPosition();
    this.placesAutocomplete();
    
    this.sub = this.activatedRoute.params.subscribe(params => {   
      this.getPropertyById(params['id']); 
     this.currentPropertyId=params['id'];
      
    });

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

  public getPropertyById(propertyId){
    var _userId=this.propertyService.getUserId();
    this.appService.getPropertyById(_userId,propertyId).subscribe(data=>{
     
      this.submitForm.controls.basic.get('title').setValue(data["title"]);
      this.submitForm.controls.basic.get('desc').setValue(data["desc"]);
      this.submitForm.controls.basic.get('propertyType').setValue( this.propertyTypes.filter(p => p.name == data["propertyType"])[0]);
      this.submitForm.controls.basic.get('roomType').setValue( this.roomTypes.filter(p => p.name == data["roomType"])[0]);

      this.submitForm.controls.address.get('neighborhood').setValue( this.neighborhoods.filter(p => p.name == data["neighborhood"])[0]);
      this.submitForm.controls.basic.get('cancellationPolicy').setValue( this.cancellationPolicyes.filter(p => p.name == data["cancellationPolicy"])[0]);


      const images: any[] = [];
      data["images"].forEach(item=>{
        let image = {
          preview: item.data
        }
        images.push(image);
      })
      this.submitForm.controls.basic.get('gallery').setValue(images);

      this.submitForm.controls.address.get('location').setValue(data["location"]);  
      this.lat = data["lat"];
      this.lng = data["lng"]; 
      this.getAddress();
      this.submitForm.controls.additional.get('bedrooms').setValue(data["bedrooms"]);  
      this.submitForm.controls.additional.get('bathrooms').setValue(data["bathrooms"]);  
      this.submitForm.controls.additional.get('bedType').setValue( this.bedTypes.filter(p => p.name == data["bedType"])[0]);
      this.submitForm.controls.additional.get('accommodates').setValue(data["accommodates"]);
      this.features[0].selected=data["coffeeMaker"];
      this.features[1].selected=data["dryer"];
      this.features[2].selected=data["microwave"];
       this.features[3].selected=data["refrigerator"];
      this.features[4].selected=data["tv"];
       this.features[5].selected=data["wifi"];
      this.features[6].selected=data["suitableForFamilies"];
      this.features[7].selected=data["kitchen"];
      this.features[8].selected=data["heating"];
      this.features[9].selected=data["iron"];
      this.features[10].selected=data["elevators"];
      this.features[11].selected=data["parking"];
      this.features[12].selected=data["cookingBasics"];
      this.features[13].selected=data["patioOrBalcony"];
      this.features[14].selected=data["dishesAndSilverware"];
      this.features[15].selected=data["ComfortableWorkplaceForLaptop"];
      this.features[16].selected=data["hotWater"];
      this.features[17].selected=data["hangers"];
      this.features[18].selected=data["stoveTop"];
      this.features[19].selected=data["shampoo"];
      this.features[20].selected=data["hairDrayer"];
      this.features[21].selected=data["oven"];
      this.features[22].selected=data["washer"];
      this.features[23].selected=data["dishWasher"];
      this.features[24].selected=data["bathTub"];
      this.features[25].selected=data["linen"];

      this.submitForm.controls.additional.get('features').setValue(this.features);

      this.submitForm.controls.address.get('zipCode').setValue(data["zipCode"]);  
    
      
      
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
      let address = response['results'][0].formatted_address; 
      this.submitForm.controls.address.get('location').setValue(address); 
      this.setAddresses(response['results'][0]); 
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
   // this.submitForm.controls.address.get('zipCode').setValue(null);
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



  public step = 0;
  setStep(index: number) {
    this.step = index;
  }
  onSubmitForm(form){
    console.log();
    if(this.submitForm.get(form).valid){
      this.nextStep();
      if(form == "Additional"){

        this.snackBar.open('The property "' + this.property.title + '" has been updated.', '×', {
          verticalPosition: 'top',
          duration: 5000 
        }); 
      }
      
    }

  }
  onProperryFormSubmit(values:Object):void
  {
   if (this.submitForm.valid) {
     this.propertyService.updateProperty(this.currentPropertyId,values).subscribe((res: HttpResponse<any>) => {

      });

    }
  
  
}
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }



}
