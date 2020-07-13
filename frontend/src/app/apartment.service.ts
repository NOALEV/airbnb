import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpResponse } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  http: any;
  webService: any;

  constructor(private webReqService: WebRequestService,private route: ActivatedRoute, private router: Router,private authService: AuthService) { }


  getApartments() {
    return this.webReqService.get('Apartments');
  }

  createApartment(title: string) {
    // We want to send a web request to create a list
    return this.webReqService.post('apartments', { title });
  }

  updateApartment(id: string, title: string) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`apartments/${id}`, { title });
  }


  deleteApartment(id: string) {
    return this.webReqService.delete(`apartments/${id}`);
  }

  getNewAccessToken() {
    return this.http.get(`${this.webService.ROOT_URL}/users/me/access-token`, {
      headers: {
        'x-refresh-token': this.getRefreshToken(),
        '_id': this.getUserId()
      },
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token'));
      })
    )
  }
  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }
 

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }
}










