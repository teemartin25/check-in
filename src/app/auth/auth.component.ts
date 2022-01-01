import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  options: string[] = ['login', 'signup'];
  error: string = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService
  ) {}

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;
  private activatedSub4: Subscription;

  onSwitchMode(option) {
    if (option === 'login') this.isLoginMode = true;
    if (option === 'signup') this.isLoginMode = false;
  }

  ngOnInit(): void {}

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    if (this.isLoginMode) {
      this.activatedSub1 = this.authService.login(email, password).subscribe(
        (resData) => {
          this.navigateToNextPage();
          //this.isLoading = false; // We commented this out because we still need the spinner showing as it's still doing an API fetch for the updatedUsers and updatedActivities
        },
        (errorMessage) => {
          // console.log(errorMessage);
          this.error = errorMessage;
          this.isLoading = false;
        }
      );
    } else {
      this.activatedSub2 = this.authService.signup(email, password).subscribe(
        (resData) => {
          // console.log(resData);
          this.isLoading = false;
          this.router.navigate(['/create-profile']);
        },
        (errorMessage) => {
          // console.log(errorMessage);

          this.error = errorMessage;
          this.isLoading = false;
        }
      );
    }

    form.reset();
    this.isLoginMode = true; // Don't remove this. It resets the form button to default value.
  }

  getLoggedInUser() {
    return new Promise((resolve, reject) => {
      this.activatedSub3 = this.authService.user.subscribe((loggedInUser) => {
        if (loggedInUser) resolve(loggedInUser);
      });
    });
  }

  getUpdatedUsers() {
    return new Promise((resolve, reject) => {
      this.activatedSub4 = this.usersService.updatedUsers.subscribe(
        (updatedUsers) => {
          if (updatedUsers) resolve(updatedUsers);
        }
      );
    });
  }

  async navigateToNextPage() {
    const data: any = await Promise.all([
      this.getLoggedInUser(),
      this.getUpdatedUsers(),
    ]);

    const [loggedInUser, updatedUsers] = data;

    const user = updatedUsers.find(
      (user) => user.emailAddress === loggedInUser.email
    );

    if (user) {
      this.router.navigate(['/users']);
    } else {
      this.router.navigate(['/create-profile']);
    }

    // console.log(loggedInUser);
    // console.log(updatedUsers);
    // console.log(user);
  }
}
