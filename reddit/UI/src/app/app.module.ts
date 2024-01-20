import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { NavigationServiceService } from './services/navigation-service.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RegisterComponent } from './register/register.component';
import { ChangeDataComponent } from './change-data/change-data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { interceptorHTTP } from './services/interceptorHTTP.service';
import { LogoutComponent } from './logout/logout.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { AddPostComponent } from './add-post/add-post.component';
import { CommentComponent } from './comment/comment.component';
import { InterestsComponent } from './interests/interests.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavigationMenuComponent,
    RegisterComponent,
    ChangeDataComponent,
    ProfileComponent,
    LogoutComponent,
    MyPostsComponent,
    AddPostComponent,
    CommentComponent,
    InterestsComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    FormsModule
    
    
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:interceptorHTTP,
      multi:true,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
