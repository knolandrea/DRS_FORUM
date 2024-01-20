import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User_login } from '../models/user.model';
import { NavigationServiceService } from '../services/navigation-service.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  users:User_login={
    email: '',
    password: ''
  };

  constructor(private nav: NavigationServiceService, private route: Router,private formbuilder:FormBuilder) { }


  form=this.formbuilder.group(
    {email:'',password:''}
  );


   sendLoginData(): void{
    console.log(this.users.email);
    this.users.email=this.form.value.email as string;
    if(this.users.email.trim()==""){
      window.alert("All fields are required!")
      return;
    }

    this.users.password=this.form.value.password as string;
    if(this.users.password.trim()==""){
      window.alert("All fields are required!")
      return;
    }


    this.nav.tryLogin(this.users).subscribe(s=>{
      
      if ((s as string) == "FALSE"){
        window.alert("Invalid email or password!");
        this.nav.showLogin();
        
        
        


        
      }
      else if((s as string)!="FALSE"){
        window.alert("Succes!")
        sessionStorage.setItem('token',s['token'])
        
       
        this.route.navigate(["/home"]);
        this.nav.showNoLogin();
      }
    });



  }

  ngOnInit(){
    
  }

 
}
