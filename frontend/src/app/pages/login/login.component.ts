import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router'; 
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import {User} from 'src/app/models/user.model';
import {UserService} from 'src/app/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public hide = true;
  auth2: any;
 

  @ViewChild('loginRef', {static: true }) loginElement: ElementRef; 

  constructor(private userService: UserService,private authService: AuthService,public fb: FormBuilder,public snackBar: MatSnackBar, public router:Router ,private ref: ChangeDetectorRef) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
   }

   this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
         // trick the Router into believing it's last link wasn't previously loaded
         this.router.navigated = false;
         // if you need to scroll back to top, here is the right place
         window.scrollTo(0, 0);
      }
  });


   }
  fbLibrary() {
 
    (window as any).fbAsyncInit = function() {
      window['FB'].init({
        appId      : '269228014171205',
        cookie     : true,
        xfbml      : true,
        version    : 'v7.0'
      });
      window['FB'].AppEvents.logPageView();
    };
 
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
 
}


  ngOnInit() {
    this.removeSession();
    this.googleSDK();
    this.fbLibrary();
    this.loginForm = this.fb.group({
      username: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      rememberMe: false
    });

  }

  private removeSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }


  prepareLoginButton() {
 
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
   
        let profile = googleUser.getBasicProfile();
     
        //YOUR CODE HERE
        var user = { 
          username:profile.getName(),
          email:profile.getEmail(),
          password: profile.getId(),
          imageUrl: profile.getImageUrl()
       }; 
        
       this.authService.signup(user).subscribe((res: HttpResponse<any>) => {
        
         var authUser ={
          username:profile.getEmail(), 
          password:profile.getId(),
          rememberMe:false
         }
         this.onLoginFormSubmit(authUser,true);
        
      });


   
   
      }, (error) => {
      });
   
  }
  googleSDK() {
 
  window['googleSDKLoaded'] = () => {
    window['gapi'].load('auth2', () => {
      this.auth2 = window['gapi'].auth2.init({
        client_id: '642674625564-ubs07ugemd7c6bm5r8e0f0qjg0l79888.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.prepareLoginButton();
    });
  }
 
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'google-jssdk'));
 
}

  
  signInWithFB(): void {
       window['FB'].login((response) => {
          console.log('login response',response);
          if (response.authResponse) {
   
            window['FB'].api('/me', {
              fields: 'last_name, first_name, email,id'
            }, (userInfo) => {
              var user = { 
                username:userInfo.first_name + " " + userInfo.last_name, 
                email:userInfo.email,
                password:userInfo.id 
             }; 
              
             this.authService.signup(user).subscribe((res: HttpResponse<any>) => {
               var authUser ={
                username:userInfo.email, 
                password:userInfo.id ,
                rememberMe:false
               }
               this.onLoginFormSubmit(authUser,true);
              
            });
            });
             
          } else {
            console.log('User login failed');
          }
      }, {scope: 'email'});
  
  } 

  public onLoginFormSubmit(values:Object ,flag:boolean):void {
    if (this.loginForm.valid || flag) {
      this.authService.login(values).subscribe((res: HttpResponse<any>) => {
     
        if (res.status === 200 && res.body) {
  
          this.userService.setCurrent(res.body);
          // we have logged in successfully
          this.router.navigate(['/']);
        }

        else{
          this.snackBar.open('Username or password incorrect!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

        }
        
  
      });
      
    }
  }

}
