import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import {User} from 'src/app/models/user.model';
import {UserService} from 'src/app/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation:true
  };
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen:boolean = true;
  public links = [ 
    { name: 'My Properties', href: 'my-properties', icon: 'view_list' },
    { name: 'Submit Property', href: '/submit-property', icon: 'add_circle' },  
    { name: 'Logout', href: '/login', icon: 'power_settings_new' },    
  ]; 

  constructor(public router:Router,private userService: UserService) { }

  ngOnInit() {
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {  
        if(window.innerWidth < 960){
          this.sidenav.close(); 
        }
      }                
    });
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
return user ?user.imageUrl :"";

 }
  


}
