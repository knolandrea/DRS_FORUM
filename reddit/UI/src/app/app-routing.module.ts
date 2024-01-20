import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeDataComponent } from './change-data/change-data.component';
import { HomeComponent } from './home/home.component';
import { InterestsComponent } from './interests/interests.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';


const routes: Routes = [
  { path:'home', component: HomeComponent},
  { path:'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path:'', redirectTo: '/home', pathMatch: 'full'},
  {path:'change-data', component: ChangeDataComponent},
  {path:'profile', component: ProfileComponent},
  {path:'logout', component: LogoutComponent},
  {path:'my-posts', component: MyPostsComponent},
  {path:'interests', component: InterestsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
