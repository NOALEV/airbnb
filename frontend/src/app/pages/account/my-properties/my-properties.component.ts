import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth.service';
import { PropertyService } from 'src/app/property.service';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.scss']
})
export class MyPropertiesComponent implements OnInit {
  displayedColumns: string[] = [ 'image', 'title','location', 'published', 'actions' ];
  dataSource: MatTableDataSource<Property>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(public appService:AppService,private authService: AuthService, private propertyService: PropertyService) { }

  ngOnInit() {
    var _userId=this.propertyService.getUserId();
    this.appService.getProperties(_userId).subscribe( res  => {
     
    var propertysArr :Property[];
    propertysArr= <Property[]> res;
      this.dataSource = new MatTableDataSource(propertysArr);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });    
  }
  
  public remove(property:Property) {
    var _userId=this.propertyService.getUserId();

    this.propertyService.deleteApartment(_userId).subscribe((res: any) =>{
    const index: number = this.dataSource.data.indexOf(property);    
    if (index !== -1) {
      this.dataSource.data.splice(index,1);
      this.dataSource = new MatTableDataSource<Property>(this.dataSource.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    
    } 
  
  });
}


  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}