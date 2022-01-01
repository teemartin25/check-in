import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth/auth.component';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { TimelineComponent } from './timeline/timeline.component';
import { UsersComponent } from './users/users.component';
import { MaterialModule } from './material/material.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DatePipe } from './date.pipe';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { LeftFooterComponent } from './footer/left-footer/left-footer.component';
import { RightFooterComponent } from './footer/right-footer/right-footer.component';
import { LoadingSpinnerComponent } from './auth/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { TableTimelineComponent } from './timeline/table-timeline/table-timeline.component';
import { Table1Pipe } from './timeline/table-timeline/table1.pipe';
import { Table2Pipe } from './timeline/table-timeline/table2.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    CreateProfileComponent,
    TimelineComponent,
    UsersComponent,
    UserProfileComponent,
    EditProfileComponent,
    DatePipe,
    FooterComponent,
    LeftFooterComponent,
    RightFooterComponent,
    LoadingSpinnerComponent,
    TableTimelineComponent,
    Table1Pipe,
    Table2Pipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
      progressAnimation: 'increasing',
      preventDuplicates: true,
    }),
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
