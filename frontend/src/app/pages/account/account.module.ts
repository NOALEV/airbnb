import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InputFileModule } from 'ngx-input-file';
import { AgmCoreModule } from '@agm/core';  
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 

import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileComponent } from './profile/profile.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { MyPropertiesComponent } from './my-properties/my-properties.component';
import { MapPropertyComponent } from './map-property/map-property.component';
import { GraphPropertyComponent } from './graph-property/graph-property.component';
import { SimilarPropertiesComponent } from './similar-properties/similar-properties.component';
import { AllPropertiesComponent } from '../neighbourhood/all-properties/all-properties.component'


export const routes = [
  { 
    path: '', 
    component: AccountComponent, children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' }, 
      { path: 'my-properties', component: MyPropertiesComponent },
      { path: 'my-properties/:id', component: EditPropertyComponent },
      { path: 'my-properties/:id/map', component: MapPropertyComponent },
      { path: 'my-properties/:id/graph', component: GraphPropertyComponent },
      { path: 'my-properties/:id/similar', component: SimilarPropertiesComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    AccountComponent,  
    MyPropertiesComponent, 
    FavoritesComponent, 
    ProfileComponent, 
    EditPropertyComponent, 
    GraphPropertyComponent, 
    SimilarPropertiesComponent,
    MapPropertyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    InputFileModule,
    SharedModule,
    AgmCoreModule
  ]
})
export class AccountModule { }
