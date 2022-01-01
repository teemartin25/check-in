import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserA } from '../auth/userA.model';
import { User } from '../user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  id: string;
  user: User;
  users: User[];
  authenticatedUser: UserA;
  loggedInUser: User;

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.activatedSub1 = this.authService.user.subscribe((user) => {
      this.authenticatedUser = user;
    });

    this.activatedSub2 = this.usersService.updatedUsers.subscribe((users) => {
      this.users = users;
      this.user = this.users.find((user) => user.userName === this.id);

      const loggedInUser = this.users.find(
        (user) => user.emailAddress === this.authenticatedUser.email
      );

      this.loggedInUser = loggedInUser;
      // console.log(this.loggedInUser.emailAddress);
      // console.log(this.user.userName);
    });

    this.activatedSub3 = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.user = this.users.find((user) => user.userName === this.id);
    });
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
    this.activatedSub3.unsubscribe();
  }
}
