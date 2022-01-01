import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateProfileComponent } from './create-profile/create-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { TimelineComponent } from './timeline/timeline.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: AuthComponent },
  {
    path: 'create-profile',
    component: CreateProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: 'timeline', component: TimelineComponent, canActivate: [AuthGuard] },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    children: [
      { path: ':id', component: UserProfileComponent },
      { path: ':id/edit', component: EditProfileComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
