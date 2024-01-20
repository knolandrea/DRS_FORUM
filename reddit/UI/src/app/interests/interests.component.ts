import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';
import { NavigationServiceService } from '../services/navigation-service.service';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})


export class InterestsComponent {
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
      this.nav.showNoLogin()
      this.home()
    })
  }
  show:boolean=false;

  

  temp:Post[] = []
  home(): void{
    this.nav.home()
    .subscribe(x => {
      console.log(x);
      x.forEach(x => {
        if(this.msg.interests.includes(x.id) && x.isDeleted==0)
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
  const { likedTopic, unlikedTopic,interests } = this.msg;

  this.posts.forEach(post => {
    post.liked = likedTopic.includes(post.id);
    post.disliked = unlikedTopic.includes(post.id);
    post.notified=interests.includes(post.id)
  });
  }

  notifyPost(id:any){

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
            this.nav.tryNotify(id).subscribe()
            return}
     
          else{
            post.notified=false;
            this.nav.tryUnnotify(id).subscribe()
             return
         }
    
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
}
