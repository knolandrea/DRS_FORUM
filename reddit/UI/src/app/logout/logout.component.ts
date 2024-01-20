import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationServiceService } from '../services/navigation-service.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
constructor(private router:Router,private nav:NavigationServiceService){}

ngOnInit() 
 {
  
  
  this.nav.tryLogout().subscribe(x=>{
    if(x=="TRUE"){
      console.log("IZLOGOVAO SE!")
      
      sessionStorage.removeItem('token');
      this.nav.showLogin();
      this.router.navigate(["/home"])
      
      window.alert("LOGOUT SUCCESSFUL!");
    }
    else{
      this.router.navigate(["/home"])
      window.alert("SOMETHING WENT WRONG!");

      
      
    }
    this.router.navigate(["/home"])
    
  })
}
}
