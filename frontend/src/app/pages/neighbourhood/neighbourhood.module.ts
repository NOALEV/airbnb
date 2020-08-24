import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';  
import { AllPropertiesComponent } from './all-properties/all-properties.component'
import { SharedModule } from '../../shared/shared.module';


export const routes = [
  { path: '', component: AllPropertiesComponent , pathMatch: 'full'  }
];


@NgModule({
  declarations: [AllPropertiesComponent],
  imports: [
    CommonModule,
    AgmCoreModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class NeighbourhoodModule { }
