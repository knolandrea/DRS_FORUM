import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { NavigationServiceService } from '../services/navigation-service.service';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
  
  
  





  constructor(public navCondition: NavigationServiceService,private formbuilder:FormBuilder,private router: Router) {}

 



  form=this.formbuilder.group(
    {username:'',password:'',firstName:'',lastName:'',address:'',country:'',email:'',phoneNumber:''}
  );
  
  sendRegisterData(): void{
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

    

    this.navCondition.tryRegister(this.users).subscribe(s=>{
      window.alert(s as string);
      if ((s as string) == "Succes!"){
        this.router.navigate(["/home"])
      }
    });
    
  }

  
  
  
  ngOnInit() {
    
    
    
  }

 
  
}
