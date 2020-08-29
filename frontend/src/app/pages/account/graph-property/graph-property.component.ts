import { Component, OnInit } from '@angular/core';
import { HChartsSettings, ChartType } from 'src/app/shared/chart/chart.component.interface';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from 'src/app/property.service';


@Component({
  selector: 'app-graph-property',
  templateUrl: './graph-property.component.html',
  styleUrls: ['./graph-property.component.scss']
})
export class GraphPropertyComponent implements OnInit {

  public chartsSettings: HChartsSettings;
  
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
    this.appService.getAirbnbPropertiesByParams(values.propertyType, values.bedrooms).subscribe(data => {
  
        var airbnbProperties = data as any[];
        var dataSet: Chart.ChartDataSets[] = [];
        for (var entity of airbnbProperties) {
            var chartData: Chart.ChartDataSets = { data: [this.getPriceAsNumber(entity.price), this.getPriceAsNumber(entity.weekly_price), this.getPriceAsNumber(entity.monthly_price)], label: entity.name };
            //airbnbProperties
            dataSet.push(chartData);
        }
        this.setChartData(dataSet);
    });
  }

  setChartData(datasets: Chart.ChartDataSets[]) {
    this.chartsSettings = {
        chartType: ChartType.Lines,
        isShowLegend: true,
        labels: ['daily price', 'weekly price', 'monthly price'],
        datasets: datasets
    } as HChartsSettings;
  }
    
  private getPriceAsNumber(price: string) {
    price = price.replace("$", "");
    return Number(price)
  }

  
}
