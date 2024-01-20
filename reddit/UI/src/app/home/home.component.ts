import { Component, Injectable, ViewChild } from '@angular/core';
import { FormBuilder, SelectControlValueAccessor } from '@angular/forms';
import { Router, TitleStrategy } from '@angular/router';
import { of } from 'rxjs';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { NavigationServiceService } from '../services/navigation-service.service';
import { BuiltinType } from '@angular/compiler';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private navService: NavigationServiceService,
              private router: Router,
              private formBuilder:FormBuilder) {}
  posts:Post[]=[]
  post_temp:Post[]=[]
 
  
  sortUp:boolean=false;
  sortDown:boolean=false;
  sortComm:boolean=false;

  


  ngOnInit(): void {
    this.navService.getUserProfile().subscribe(x=>{
      this.msg=x;
      if(this.msg!="FALSE"){
        this.loggedIn=true;
        this.navService.showNoLogin()
      }

      this.home()

     });
  }
  home(): void{
    this.navService.home()
    .subscribe(x => {
      console.log(x);
      console.log("hahahahhahhahahaha")
      x.forEach(post=>{
        if(post.isDeleted==0){
          this.posts.push(post)
        }
      })

      this.post_temp=JSON.parse(JSON.stringify(this.posts));
      

      
      this.setFalse()

    })
  }

  
  msg:any;
  show:boolean=false;
  loggedIn:boolean=false;

  ShowAddPost(){
    if(this.show==true){
      this.show=false;
    }
    else{
      this.show=true;
    }
  }
  ShowAddComment(id:number){
    const post = this.posts.find(x => x.id === id);
      if(post){
        if(post.showComment==true){
          post.showComment=false;
        }
        else{
          post.showComment=true;
        }
     }
  }

  public async likePost(id:number){
    if(this.msg == "FALSE")
    {
      this.router.navigate(["/login"])
      return;
    }
    const post = this.posts.find(x => x.id === id);
      if(post){
          post.liked=true;
          post.likes++;
          if(post.disliked==true){
            this.undislikePost(id);
            await new Promise(f=>setTimeout(f,80))
          }
          this.navService.tryLike(id).subscribe();
          return;
      } 
  }
  public unlikePost(id:number){
    const post = this.posts.find(x => x.id === id);
      if(post){
        post.liked=false;
        post.likes--
        this.navService.tryunLike(id).subscribe()
        return;
      }
  }

  public async dislikePost(id:number){
    if(this.msg == "FALSE")
    {
      this.router.navigate(["/login"])
      return;
    }
    const post = this.posts.find(x => x.id === id);
      if(post){
          post.disliked=true;
          post.dislikes++;
          if(post.liked==true){
            this.unlikePost(id);
            await new Promise(f=>setTimeout(f,80))
          }
          this.navService.tryDislike(id).subscribe();
          return;
        
      }
  }
  public undislikePost(id:number){
    const post = this.posts.find(x => x.id === id);
      if(post){
        post.disliked=false;
        post.dislikes--
        this.navService.tryunDislike(id).subscribe()
      }
  }

setFalse(){
  const { likedTopic, unlikedTopic, interests } = this.msg;

  this.posts.forEach(post => {
    post.liked = likedTopic.includes(post.id);
    post.disliked = unlikedTopic.includes(post.id);
    post.notified = interests.includes(post.id);
    
  });
  }

public notifyPost(id:any){

  if(this.msg == "FALSE")
  {
    this.router.navigate(["/login"])
    return
  }
const User = this.msg;
const post = this.posts.find(x => x.id === id)
   if(post){

   if(post.notified==false)
        {post.notified=true;
          this.navService.tryNotify(id).subscribe()
          return}
   
        else{
          post.notified=false;
          this.navService.tryUnnotify(id).subscribe()
           return
       }
  
       } 
      }



sortUpvotes(){
  if(this.sortUp==true){
    this.sortUp=false;
    window.location.reload()
  }
  else{
    this.sortUp=true;
    this.sortDown=false;
    this.sortComm=false;
    this.posts.sort((a,b)=>(a.likes>b.likes? -1: 1))
    this.post_temp=JSON.parse(JSON.stringify(this.posts));
   
  }
}

sortDownvotes(){

  if(this.sortDown==true){
    this.sortDown=false;
    window.location.reload()
  }
  else{
    this.sortDown=true;
    this.sortUp=false;
    this.sortComm=false;
    this.posts.sort((a,b)=>(a.dislikes>b.dislikes? -1: 1))
    this.post_temp=JSON.parse(JSON.stringify(this.posts));
    
  }

}

sortComments(){
  
  if(this.sortComm==true){
    this.sortComm=false;
    window.location.reload()
  }
  else{
    this.sortDown=false;
    this.sortUp=false;
    this.sortComm=true;
    this.posts.sort((a,b)=>(a.commentsNumber>b.commentsNumber? -1: 1))
    this.post_temp=JSON.parse(JSON.stringify(this.posts));
    
  }



}
   
searchform = this.formBuilder.group({searchField:""})

searchPosts()
{
  
  this.posts=JSON.parse(JSON.stringify(this.post_temp))
  var postt:Post[] = [];
  this.posts.forEach(post=>{
    if(post.title.toLowerCase().includes(((this.searchform.value.searchField) as string).toLowerCase()) == true){
      
      postt.push(post)
    }
    this.posts = postt;
  })

  
 
}


 
}






