import { TemplateBindingParseResult } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';
import { NavigationServiceService } from '../services/navigation-service.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.scss']
})


export class MyPostsComponent implements OnInit {
  msg:any;
  navService: any;
  constructor(private nav:NavigationServiceService,private router:Router){}
  posts:Post[]=[]
  ngOnInit() {
    this.nav.getUserProfile().subscribe(x=>{
      this.msg=x;
      if(this.msg=='FALSE'){
        this.router.navigate(["/home"])
      }
      else{
        this.nav.showNoLogin()
      }
      this.home()
    })
  }
  show:boolean=false;

  ShowAddPost(){
    if(this.show==true){
      this.show=false;
    }
    else{
      this.show=true;
    }
  }

  temp:Post[] = []
  home(): void{
    this.nav.home()
    .subscribe(x => {
      console.log(x);
      x.forEach(x => {
        if(x.user_id == this.msg.id && x.isDeleted==0)
        {
            this.temp.push(x);
        }
      });
      this.posts = this.temp;
      this.setFalse()

    })
  }

  async likePost(id:number){
    if(this.msg == "FALSE")
    {
      this.router.navigate(["/login"])
    }
    const post = this.posts.find(x => x.id === id);
      if(post){
          post.liked=true;
          post.likes++;
          if(post.disliked==true){
            this.undislikePost(id);
            await new Promise(f=>setTimeout(f,80))
          }
          this.nav.tryLike(id).subscribe();
          return;
      } 
  }
  unlikePost(id:number){
    const post = this.posts.find(x => x.id === id);
      if(post){
        post.liked=false;
        post.likes--
        this.nav.tryunLike(id).subscribe()
        return;
      }
  }

  async dislikePost(id:number){
    if(this.msg == "FALSE")
    {
      this.router.navigate(["/login"])
    }
    const post = this.posts.find(x => x.id === id);
      if(post){
          post.disliked=true;
          post.dislikes++;
          if(post.liked==true){
            this.unlikePost(id);
            await new Promise(f=>setTimeout(f,80))
          }
          this.nav.tryDislike(id).subscribe();
          return;
        
      }
  }
  undislikePost(id:number){
    const post = this.posts.find(x => x.id === id);
      if(post){
        post.disliked=false;
        post.dislikes--
        this.nav.tryunDislike(id).subscribe()
      }
  }

setFalse(){
  const { likedTopic, unlikedTopic } = this.msg;

  this.posts.forEach(post => {
    post.liked = likedTopic.includes(post.id);
    post.disliked = unlikedTopic.includes(post.id);
  });
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
  DisableComments(id:number){
    const post = this.posts.find(x => x.id === id);
      if(post){

        if(post.isClosed==0){
          post.isClosed=1;
          this.nav.tryClosePost(id).subscribe()
        }
        else{
          post.isClosed=0;
          this.nav.tryClosePost(id).subscribe()
        }
     }
  }

  deletePost(id:number){
    const post = this.posts.find(x => x.id === id);
    if(post){
      
        post.isDeleted=1;
        this.nav.tryDeletePost(id).subscribe()
        window.alert("Post deleted successfully!")
      }
  }

}