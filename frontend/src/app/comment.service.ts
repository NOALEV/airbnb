import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpResponse } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CommentService {
  http: any;
  webService: any;

  constructor(private webReqService: WebRequestService,private route: ActivatedRoute, private router: Router,private authService: AuthService) { }

  getComments() {
    return this.webReqService.get('comments');
  }

  createComment(values: object) {
    values["_userId"]=this.getUserId();
    // We want to send a web request to create a propery
    return this.webReqService.post('commment', { values });
  }

  updateComment(id: string, values: object) {
    // We want to send a web request to update a list
    return this.webReqService.patch(`comments/${id}`, { values });
  }


  deleteComment(id: string) {
    return this.webReqService.delete(`comments/${id}`);
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