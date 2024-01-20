import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { NavigationServiceService } from '../services/navigation-service.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(private nav:NavigationServiceService,private router:Router){}
 user!: any;
 
  ngOnInit(){
    
    this.nav.getUserProfile().subscribe(x=>{
      this.user=x;
      if(this.user=="FALSE"){
        this.nav.showLogin();
        this.router.navigate(["/home"])
        
      }
      else{
          this.nav.showNoLogin()
        } 
    
    })
    
    
    
    
  }
}
