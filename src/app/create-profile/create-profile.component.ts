import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { UserA } from '../auth/userA.model';
import { TimelineService } from '../timeline/timeline.service';
import { User } from '../user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css'],
})
export class CreateProfileComponent implements OnInit, OnDestroy {
  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  constructor(
    private usersService: UsersService,
    private timelineSerice: TimelineService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  users: User[];
  genders = ['male', 'female'];
  signupForm: FormGroup;
  loggedInUser: UserA;
  loggedInUserProfile: User;
  allowedToCreate: boolean;
  addedUser: User = {
    name: ``,
    userName: ``,
    emailAddress: ``,
    gender: ``,
    hobbies: ``,
    phoneNumber: +``,
    imagePath: ``,
    status: ``,
  };

  forbiddenUsernames = [];

  ngOnInit(): void {
    this.activatedSub1 = this.authService.user.subscribe(
      (user) => (this.loggedInUser = user)
    );

    this.activatedSub2 = this.usersService.updatedUsers.subscribe(
      (updatedUsers) => {
        if (updatedUsers) {
          const index = updatedUsers.findIndex(
            (user) => user.emailAddress === this.loggedInUser.email
          );

          this.loggedInUserProfile = updatedUsers[index];

          if (index === -1) {
            this.allowedToCreate = true;
          } else {
            this.allowedToCreate = false;
          }

          for (const key in updatedUsers) {
            this.forbiddenUsernames.push(updatedUsers[key].userName);
          }

          // console.log(this.forbiddenUsernames);
        }
      }
    );

    this.signupForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      userName: new FormControl(null, [
        Validators.required,
        this.forbiddenNames.bind(this),
      ]),
      emailAddress: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      gender: new FormControl('male', Validators.required),
      hobbies: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      imagePath: new FormControl(null, Validators.required),
      status: new FormControl(null),
    });

    this.signupForm.patchValue({
      emailAddress: this.loggedInUser.email,
      status: `🟢 I'm online!`,
    });
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
  }

  onSubmit() {
    if (!this.allowedToCreate) {
      this.triggerModal();
      //console.log(`Sorry you're not allowed to create`);

      return;
    }

    this.addedUser = new User(
      this.signupForm.value.name,
      this.signupForm.value.userName,
      this.signupForm.value.emailAddress,
      this.signupForm.value.gender,
      this.signupForm.value.hobbies,
      this.signupForm.value.phoneNumber,
      this.signupForm.value.imagePath,
      this.signupForm.value.status,
      this.signupForm.value.id
    );

    this.usersService.onCreatePost(this.addedUser);
    this.timelineSerice.logNewAccount(this.addedUser);
    this.router.navigate(['/users', this.loggedInUserProfile.userName]);
    this.showSuccessToast();
    //this.authService.user.next(this.loggedInUser);
  }

  showSuccessToast() {
    const firstName = this.addedUser.name.slice(
      0,
      this.addedUser.name.indexOf(' ')
    );

    this.toastr.success('Your profile is created.', `Hello ${firstName}!`);
  }

  triggerModal() {
    const element = document.getElementById('openModalButton');
    element.click();
  }

  triggerDeletedModal() {
    const element = document.getElementById('openSecondModalButton');
    element.click();
  }

  onModalDelete() {
    // console.log('modal DELETE');
    // console.log(this.loggedInUserProfile);

    this.timelineSerice.logDeletedAccount(this.loggedInUserProfile);
    this.usersService.onDeleteProfile(this.loggedInUserProfile);
    this.signupForm.reset();
    this.signupForm.patchValue({
      emailAddress: this.loggedInUser.email,
    });

    this.triggerDeletedModal();
  }

  onModalKeepProfile() {
    // console.log('modal KEEP');
    // console.log(this.loggedInUserProfile);
    this.router.navigate(['/users', this.loggedInUserProfile.userName]);
  }

  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return { nameIsForbidden: true };
    }
    return null;
  }
}
