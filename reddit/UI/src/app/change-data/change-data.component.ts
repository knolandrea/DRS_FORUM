import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { NavigationServiceService } from '../services/navigation-service.service';

@Component({
  selector: 'app-change-data',
  templateUrl: './change-data.component.html',
  styleUrls: ['./change-data.component.scss']
})
export class ChangeDataComponent implements OnInit{
  users:User={
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    country: '',
    email: '',
    phoneNumber: '',
    likedTopic:[],
    unlikedTopic:[],
    interests:[]
  };
  
  
  user!:any;





  constructor(public navCondition: NavigationServiceService,private formbuilder:FormBuilder,private router: Router) {}

 



  form=this.formbuilder.group(
    {username:'',password:'',firstName:'',lastName:'',address:'',country:'',email:'',phoneNumber:''}
  );
  
  sendChangeData(): void{
    console.log(this.users.username);
    this.users.username=this.form.value.username as string;
    if(this.users.username.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.password=this.form.value.password as string;
    if(this.users.password.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.address=this.form.value.address as string;
    if(this.users.address.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.country=this.form.value.country as string;
    if(this.users.country.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.email=this.form.value.email as string;
    if(this.users.email.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.firstName=this.form.value.firstName as string;
    if(this.users.firstName.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.lastName=this.form.value.lastName as string;
    if(this.users.lastName.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.phoneNumber=this.form.value.phoneNumber as string;
    if(this.users.phoneNumber.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.likedTopic=this.user.likedTopic;

    this.users.unlikedTopic=this.user.unlikedTopic;

    this.users.interests=this.user.interests;
    

    

    this.navCondition.tryChangeData(this.users).subscribe(s=>{
      
      if ((s as string) == "TRUE"){
        window.alert("Profile updated successfully")
        this.router.navigate(["/profile"])
      }
    });
    
  }

  
  
  
  ngOnInit() {
    
    this.navCondition.getUserProfile().subscribe(x=>{
      this.user=x
      if(this.user=='FALSE'){
        
        this.router.navigate(['/home'])
      }
      this.navCondition.showNoLogin()
      
      

      

    })
    
  
  
  
  }
}
