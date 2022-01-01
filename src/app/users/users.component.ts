import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[];
  selectedUser: User;
  currentLoggedInUser: User;
  showSelectAProfile: boolean;
  isLoading: boolean = true;

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;

  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedSub1 = this.usersService.updatedUsers.subscribe(
      (updatedUsers) => {
        if (updatedUsers) {
          // console.log(this.users);
          // console.log(updatedUsers);
          this.users = updatedUsers.slice().reverse();
          this.getCurrentLoggedInProfile();
        }
      }
    );
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
    this.activatedSub3.unsubscribe();
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.usersService.selectedUser.next(user);
    this.showSelectAProfile = false;
  }

  getLoggedInUser() {
    return new Promise((resolve, reject) => {
      this.activatedSub2 = this.authService.user.subscribe((loggedInUser) => {
        if (loggedInUser) resolve(loggedInUser);
      });
    });
  }

  getUpdatedUsers() {
    return new Promise((resolve, reject) => {
      this.activatedSub3 = this.usersService.updatedUsers.subscribe(
        (updatedUsers) => {
          if (updatedUsers) resolve(updatedUsers);
        }
      );
    });
  }

  async getCurrentLoggedInProfile() {
    const data: any = await Promise.all([
      this.getLoggedInUser(),
      this.getUpdatedUsers(),
    ]);

    const [loggedInUser, updatedUsers] = data;

    const user = updatedUsers.find(
      (user) => user.emailAddress === loggedInUser.email
    );

    if (!user) this.showSelectAProfile = true;

    this.currentLoggedInUser = user;
    // console.log(loggedInUser);
    // console.log(updatedUsers);

    setTimeout(() => {
      const element = document.getElementById(`${loggedInUser.email}`);

      if (element) {
        element.click();
      }
    }, 1);
    // SetTimeout is necessary as we need to let the HTML run first because we're getting the ElementID there.

    setTimeout(() => {
      const elementScroll = document.getElementById(loggedInUser.email);
      if (elementScroll) {
        elementScroll.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    }, 300);
  }

  //Spinner on each image for the userlist
  imageLoaded(id, imageId) {
    const spinnerElement = document.getElementById(id);
    const imageElement = document.getElementById(imageId);
    spinnerElement.classList.remove('spinner-border');
    imageElement.classList.remove('visually-hidden');
  }
}
