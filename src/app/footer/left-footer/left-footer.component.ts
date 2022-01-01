import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserA } from 'src/app/auth/userA.model';
import { User } from 'src/app/user.model';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-left-footer',
  templateUrl: './left-footer.component.html',
  styleUrls: ['./left-footer.component.css'],
})
export class LeftFooterComponent implements OnInit, OnDestroy {
  users: User[];
  loggedInUser: UserA;
  currentUser: User;

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;
  private activatedSub4: Subscription;
  private activatedSub5: Subscription;
  private activatedSub6: Subscription

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedSub1 = this.authService.user.subscribe((user) => {
      if (user) {
        this.getCurrentUser();
      } else {
        this.currentUser = null;
      }
    });

    this.activatedSub2 = this.usersService.updatedUsers.subscribe(
      (updatedUsers) => {
        this.users = updatedUsers;
        this.getCurrentUser();
      }
    );
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
    this.activatedSub3.unsubscribe();
    this.activatedSub4.unsubscribe();
    this.activatedSub5.unsubscribe();
    this.activatedSub6.unsubscribe();
  }

  getLoggedInUser() {
    return new Promise((resolve, reject) => {
     this.activatedSub5= this.activatedSub4 = this.authService.user.subscribe((loggedInUser) => {
        if (loggedInUser) resolve(loggedInUser);
      });
    });
  }

  getUpdatedUsers() {
    return new Promise((resolve, reject) => {
 this.activatedSub6=     this.activatedSub3 = this.usersService.updatedUsers.subscribe(
        (updatedUsers) => {
          if (updatedUsers) resolve(updatedUsers);
        }
      );
    });
  }

  async getCurrentUser() {
    const data: any = await Promise.all([
      this.getLoggedInUser(),
      this.getUpdatedUsers(),
    ]);

    const [loggedInUser, updatedUsers] = data;

    this.currentUser = updatedUsers.find(
      (user) => user.emailAddress === loggedInUser.email
    );

    // console.log(this.currentUser);
  }

  navigateToProfile() {
    this.router.navigate(['/users', this.currentUser.userName]);
    this.usersService.updatedUsers.next(this.users);
    //console.log(this.users);
  }
}
