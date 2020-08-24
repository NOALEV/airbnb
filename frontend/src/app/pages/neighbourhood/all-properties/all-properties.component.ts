import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { WebRequestService } from 'src/app/web-request.service';

@Component({
  selector: 'app-all-properties',
  templateUrl: './all-properties.component.html',
  styleUrls: ['./all-properties.component.scss']
})
export class AllPropertiesComponent implements OnInit {

  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public markers = [];
  public zoom: number = 14;  
  public title: string = "XXXXX";
  
  public props;
  public nh; 


  constructor(private webReqService: WebRequestService) { }

  ngOnInit(): void {
    this.webReqService.get('getAllAirbnbProperties').subscribe( res  => {
      this.props = res;
      this.nh = res;
      this.nh = (<any[]>res).map(item => item.neighbourhood);
      // Unique neighbourhoods
      this.nh = [...new Set(this.nh)].filter(item=>item); 
    })
  }

  onChange(val) {
    
    // Filter according to neighbourhood
    const propsInNeighbourhood = (<any[]>this.props).filter(item=>item.neighbourhood === val.value)
    // Calc average longitude, latitude in order to centerize map
    const avg = this.calaAvg(propsInNeighbourhood);
    this.lat = avg.lat; 
    this.lng = avg.lng;
    this.markers = propsInNeighbourhood.map((item) => { 
      return {"lat": item.latitude, "lng":item.longitude}
    }); 
  }

  calaAvg(propsInNeighbourhood) {
    const total = propsInNeighbourhood.reduce((acc,a) => {
      return {"latitude":acc.latitude + a.latitude , "longitude": acc.longitude + a.longitude}
    } , {"latitude":0,"longitude":0}) 
   
    const avgLat = total.latitude / propsInNeighbourhood.length;
    const avgLng = total.longitude / propsInNeighbourhood.length;
    return {"lat": avgLat, "lng": avgLng}    
 }
 
    


}
