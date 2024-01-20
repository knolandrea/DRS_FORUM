import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Comment } from '../models/comment.model';
import { NavigationServiceService } from '../services/navigation-service.service';


@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() post:any;
  @Input() user:any;
  @Input() loggedIn:any;

  username:any;

  comments:Comment[]=[]

  comment:Comment={
    id:0,
    desc:'',
    user:'',
    topic:'',
    likes:0,
    dislikes:0,
    liked:false,
    disliked:false,
    user_id:0,
    topic_id:0,
  };


  constructor(public navService: NavigationServiceService,private formbuilder:FormBuilder,private router: Router) {}
  ngOnInit():void  {
    this.allComment();
    //console.log(this.comments)
  }

  form=this.formbuilder.group(
    {description:''});
  
  temp: Comment[] = []
  allComment(): void{
    this.navService.allComment()
    .subscribe(x => {
      x.forEach(x => {
        if(x.topic_id == this.post.id)
        {
            this.temp.push(x);
        }
      });
      // console.log(x);
      this.comments = this.temp;
      console.log(this.comments)
      // console.log(this.temp)
      this.setFalseComment();

    })
  }

  sendCommentData(): void{
    this.comment.desc=this.form.value.description as string;
    this.comment.topic_id = this.post.id;
    if(this.comment.desc.trim()==""){
      window.alert("Description required!")
      return;
    }
    this.navService.tryAddComment(this.comment).subscribe(x=>{
      window.alert(x as string);
    });
  }


  public async likeComment(id:number){
    if(this.user == "FALSE")
    {
      this.router.navigate(["/login"])
    }
    const comment = this.comments.find(x => x.id === id);
      if(comment){
        comment.liked=true;
        comment.likes++;
          if(comment.disliked==true){
            this.undislikeComment(id);
            await new Promise(f=>setTimeout(f,80))
          }
          this.navService.tryLikeComment(id).subscribe();
          return;
      } 
  }
  public unlikeComment(id:number){
    const comment = this.comments.find(x => x.id === id);
      if(comment){
        comment.liked=false;
        comment.likes--
        this.navService.tryunLikeComment(id).subscribe()
        return;
      }
  }

  public async dislikeComment(id:number){
    if(this.user == "FALSE")
    {
      this.router.navigate(["/login"])
    }
    const comment = this.comments.find(x => x.id === id);
      if(comment){
        comment.disliked=true;
        comment.dislikes++;
          if(comment.liked==true){
            this.unlikeComment(id);
            await new Promise(f=>setTimeout(f,80))
          }
          this.navService.tryDislikeComment(id).subscribe();
          return;
        
      }
  }
  public undislikeComment(id:number){
    const comment = this.comments.find(x => x.id === id);
      if(comment){
        comment.disliked=false;
        comment.dislikes--
        this.navService.tryunDislikeComment(id).subscribe()
      }
  }
  setFalseComment(){
    const { likedComment, unlikedComment} = this.user;

    this.comments.forEach(comment => {
      comment.liked = likedComment.includes(comment.id);
      comment.disliked = unlikedComment.includes(comment.id);
      
    });
    }
}
