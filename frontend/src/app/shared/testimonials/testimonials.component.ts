import { Component, OnInit } from '@angular/core';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';
import { CommentService } from 'src/app/comment.service';
import { Feedback } from 'src/app/app.models';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit { 
  comments: Feedback[];
  public testimonials;
  public config: SwiperConfigInterface = { };
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };

  constructor(public appService:AppService,public commentService:CommentService) { }

  ngOnInit() {
   this.commentService.getComments().subscribe((comments: Feedback[] )=>{
    this.comments = comments;
console.log(comments);
    });    

  }
  getUser() {
    
    let user:User;
    user= JSON.parse( localStorage.getItem('user')) ;
    return user;

  }

  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 1,
      spaceBetween: 0,       
      keyboard: true,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,  
      // breakpoints: {
      //   480: {
      //     slidesPerView: 1
      //   },
      //   740: {
      //     slidesPerView: 2,
      //   },
      //   960: {
      //     slidesPerView: 3,
      //   }
      // }
    }
  }

}
