import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import {User} from 'src/app/models/user.model';



@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  constructor(public authService:AuthService,private route: ActivatedRoute,public appService:AppService) { }

  ngOnInit() {

  
  }
  
  logout() {
    this.removeSession();

  }
  private removeSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

 
  getUser() {
    
    let user:User;
    user= JSON.parse( localStorage.getItem('user')) ;

    return user;
  }
 getPic()
 {
  let user:User;
  user= JSON.parse( localStorage.getItem('user')) ;
  return user ?user.imageUrl :"assets/images/others/user.jpg";

 }
  
  


}
