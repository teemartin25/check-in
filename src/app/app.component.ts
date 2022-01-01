import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { User } from './user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MartinApp';
  isAuthenticated: boolean = false;
  currentLoggedInProfile: User;
  selectedUser: User;
  private userSub: Subscription;
  private userSub2: Subscription;
  private userSub3: Subscription;
  private userSub4: Subscription;

  constructor(
    private toastr: ToastrService,
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !user ? false : true;
      //console.log(user);

      if (user) {
        this.usersService.onFetchPosts();
        this.usersService.fetchTimelineActivity();
        this.getCurrentLoggedInProfile();
      }
    });

    this.userSub2 = this.usersService.updatedUsers.subscribe((updatedUsers) => {
      this.getCurrentLoggedInProfile();
    });

    this.authService.autoLogin();

    this.userSub3 = this.usersService.selectedUser.subscribe((user) => {
      this.selectedUser = user;
    });

    this.userSub4 = this.authService.showAutoLogoutModal.subscribe(
      (autoLogoutModal) => {
        if (autoLogoutModal) {
          this.triggerAutoLogoutModal();
        } else {
          return;
        }
      }
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.userSub2.unsubscribe();
    this.userSub3.unsubscribe();
    this.userSub4.unsubscribe();
  }

  showToastr() {
    this.toastr.success('Some messages', 'title');
  }

  onLogout() {
    this.triggerLogoutModal();
  }

  onModalLogout() {
    this.removeNavToggle();
    this.authService.logout();
  }

  triggerLogoutModal() {
    const element = document.getElementById('logoutModal');
    element.click();
  }

  triggerAutoLogoutModal() {
    const element = document.getElementById('autoLogoutModal');
    element.click();
  }

  getLoggedInUser() {
    return new Promise((resolve, reject) => {
      this.authService.user.subscribe((loggedInUser) => {
        if (loggedInUser) resolve(loggedInUser);
      });
    });
  }

  getUpdatedUsers() {
    return new Promise((resolve, reject) => {
      this.usersService.updatedUsers.subscribe((updatedUsers) => {
        if (updatedUsers) resolve(updatedUsers);
      });
    });
  }

  async getCurrentLoggedInProfile() {
    const data: any = await Promise.all([
      this.getLoggedInUser(),
      this.getUpdatedUsers(),
    ]);

    const [loggedInUser, updatedUsers] = data;

    //console.log(loggedInUser);
    //console.log(updatedUsers);

    const user = updatedUsers.find(
      (user) => user.emailAddress === loggedInUser.email
    );

    if (user) {
      this.currentLoggedInProfile = user;
    } else {
      this.currentLoggedInProfile = null;
    }

    //console.log(this.currentLoggedInProfile);
  }

  //Bug fix for where if they click on the Users tab twice, this will no longer remove the User Profile page, it will still show the current logged-in profile.
  goToUsers() {
    if (this.currentLoggedInProfile === null) return;
    this.router.navigate(['/users', this.selectedUser.userName]);
  }

  //Bug fix for where it removes the toggled navbar when logging-out for small devices
  removeNavToggle() {
    const el = document.querySelector('#navbarDark');
    if (el.classList.contains('show')) {
      el.classList.remove('show');
    }
  }
}
