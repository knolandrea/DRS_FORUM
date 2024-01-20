import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Post } from '../models/post.model';
import { NavigationServiceService } from '../services/navigation-service.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent implements OnInit {
  username:any;

  posts:Post={
    id:0,
    title:'',
    description:'',
    user:'',
    likes:0,
    dislikes:0,
    liked:false,
    disliked:false,
    user_id:0,
    notified:false,
    showComment:false,

    disableComment:false,
    isClosed:0,
    isDeleted:0,
    commentsNumber:0

  };
  

  constructor(public navCondition: NavigationServiceService,private formbuilder:FormBuilder,private router: Router) {}
  ngOnInit():void  {
    
  }


  form=this.formbuilder.group(
    {title:'',description:''}
  );
  
  sendPostData(): void{
    
    this.posts.title=this.form.value.title as string;
    if(this.posts.title.trim()==""){
      window.alert("Title required!")
      return;
    }

    this.posts.description=this.form.value.description as string;
    if(this.posts.description.trim()==""){
      window.alert("Description required!")
      return;
    }

    

    

    this.navCondition.tryAddPost(this.posts).subscribe(s=>{
      window.alert(s as string);
      
    });
    
  }

}
