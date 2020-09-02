import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebRequestService, private router: Router, private http: HttpClient) { }

  login(values:Object) {
    return this.webService.login(values).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        if(!res.body.imageUrl)
        {
          res.body.imageUrl="assets/images/others/user.jpg";
        }
        
        this.setSession( res.headers.get('x-access-token'), res.headers.get('x-refresh-token'), res.body );
        console.log('LOGGED IN!');
      })
    );
  }


  signup(values:Object) {
    return this.webService.signup(values).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession( res.headers.get('x-access-token'), res.headers.get('x-refresh-token'),res.body);
        console.log('Successfully signed up and now logged in!');
      })
    );
  }
 



  logout() {
    this.removeSession();
    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

 
 

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken);
  }

  private setSession( accessToken: string, refreshToken: string,  user: any) {
   
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);

  }


  private removeSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
       
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    );
  }
}
