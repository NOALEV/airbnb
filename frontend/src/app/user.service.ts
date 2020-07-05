import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpResponse } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http: any;
  webService: any;
  currentUser:  User;
    setCurrent(user:any)
    {


    }
getCurrent(){
    return this.currentUser;
}
  constructor(private webReqService: WebRequestService,private route: ActivatedRoute, private router: Router,private authService: AuthService) { }
  getUsers() {
    return this.webReqService.get('users');
  }
  getUserPic(){
    return this.currentUser.imageUrl?this.currentUser.imageUrl:"assets/images/others/user.jpg";

  }
  getUsersCount() {
    return this.webReqService.get('users/count');
  }
  getUsersByCities() {
    return this.webReqService.get('usersByCities');  
  }
  
  getListCategoriesByUsers() {
    return this.webReqService.get('listCategoriesByUsers');  
  }
  
  deleteUser(id: string) {
    return this.webReqService.delete(`users/${id}`);
  }
  updateUser(id: string, userName: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`users/${id}`, { userName });

  }

  logout(id: string)
    {
      return this.webReqService.patch(`users/${id}`, { isConnected:false });
    }
    
}
