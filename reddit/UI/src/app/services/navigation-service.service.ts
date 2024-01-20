import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, observable, Observable,of } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { User, User_login } from '../models/user.model';


@Injectable(
  {providedIn:'root'}
)
export class NavigationServiceService  {
 
  


  LoginStatus:boolean;
  
  constructor( private http: HttpClient) {
    this.LoginStatus=true;
   }
   home(): Observable<Post[]>{
    const posts = this.http.get<Post[]>('http://127.0.0.1:5000/home');
    return posts;
   }

   getUserProfile(): Observable<User>{
    const user = this.http.get<User>('http://127.0.0.1:5000/profile');
    return user;
   }

   tryRegister(user:User){
    return this.http.post<any>('http://127.0.0.1:5000/register',user);
   }

   tryLogin(user:User_login){
    return this.http.post<any>('http://127.0.0.1:5000/login',user);
   }

   tryLogout(){
    return this.http.post<any>('http://127.0.0.1:5000/logout',"");
   }

   showLogin():void{
    this.LoginStatus=true;
   }

   showNoLogin():void{
    this.LoginStatus=false;
   }

   tryAddPost(post:Post){
    return this.http.post<any>('http://127.0.0.1:5000/add-post',post);
   }

   allComment(): Observable<Comment[]>{
    const comments = this.http.get<Comment[]>('http://127.0.0.1:5000/add-comment');
    return comments;
   }
   tryAddComment(comment:Comment){
    return this.http.post<any>('http://127.0.0.1:5000/add-comment',comment);
   }
   
   tryChangeData(user:User){
    return this.http.post<any>('http://127.0.0.1:5000/change-data',user);
   }

  tryLike(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/like',id)
  }

  tryunLike(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/unlike',id)
  }



  tryDislike(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/dislike',id)
  }

  tryunDislike(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/undislike',id)
  }

  tryNotify(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/notify',id)
  }

  tryUnnotify(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/unnotify',id)
  }
 
  /* COMMENT */

  tryLikeComment(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/likeComment',id)
  }

  tryunLikeComment(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/unlikeComment',id)
  }



  tryDislikeComment(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/dislikeComment',id)
  }

  tryunDislikeComment(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/undislikeComment',id)
  }


  tryClosePost(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/openClosePost',id)
  }

  tryDeletePost(id:number){
    return this.http.post<any>('http://127.0.0.1:5000/deletePost',id)
  }


}