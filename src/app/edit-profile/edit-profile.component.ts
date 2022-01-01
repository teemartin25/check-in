import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserA } from '../auth/userA.model';
import { TimelineService } from '../timeline/timeline.service';
import { User } from '../user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit, OnDestroy {
  id: string;
  allowEdit: boolean;
  currentUser: User;
  users: User[];
  loggedInUser: UserA;

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private timelineService: TimelineService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}
  editForm: FormGroup;
  editedUser: User = {
    name: ``,
    userName: ``,
    emailAddress: ``,
    gender: ``,
    hobbies: ``,
    phoneNumber: +``,
    imagePath: ``,
    status: ``,
  };
  ngOnInit(): void {
    this.activatedSub1 = this.authService.user.subscribe((user) => {
      this.loggedInUser = user;
    });

    this.id = this.route.snapshot.params['id'];

    this.activatedSub2 = this.usersService.updatedUsers.subscribe((users) => {
      this.users = users;

      this.currentUser = this.users.find((user) => user.userName === this.id);
      this.editForm = new FormGroup({
        name: new FormControl(null, Validators.required),
        userName: new FormControl(null, Validators.required),
        emailAddress: new FormControl(null, [
          Validators.required,
          Validators.email,
        ]),
        gender: new FormControl('male', Validators.required),
        hobbies: new FormControl(null, Validators.required),
        phoneNumber: new FormControl(null, Validators.required),
        imagePath: new FormControl(null, Validators.required),
        status: new FormControl(null, Validators.required),
      });

      if (!this.currentUser) return; // guard clause so it won't try to patch if we deleted a user

      this.editForm.patchValue({
        name: this.currentUser.name,
        userName: this.currentUser.userName,
        emailAddress: this.currentUser.emailAddress,
        gender: this.currentUser.gender,
        hobbies: this.currentUser.hobbies,
        phoneNumber: this.currentUser.phoneNumber,
        imagePath: this.currentUser.imagePath,
        status: this.currentUser.status,
        id: this.currentUser.id,
      });
    });

    this.activatedSub3 = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.allowEdit = queryParams['allowEdit'] === '1' ? true : false;
      }
    );

    this.editForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      userName: new FormControl(null, Validators.required),
      emailAddress: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      gender: new FormControl('male', Validators.required),
      hobbies: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      imagePath: new FormControl(null, Validators.required),
      status: new FormControl(null, Validators.required),
    });

    this.editForm.patchValue({
      name: this.currentUser.name,
      userName: this.currentUser.userName,
      emailAddress: this.currentUser.emailAddress,
      gender: this.currentUser.gender,
      hobbies: this.currentUser.hobbies,
      phoneNumber: this.currentUser.phoneNumber,
      imagePath: this.currentUser.imagePath,
      status: this.currentUser.status,
      id: this.currentUser.id,
    });
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
    this.activatedSub3.unsubscribe();
  }

  onSubmit() {
    this.timelineService.logActivityChange(
      this.currentUser,
      this.editForm.value
    );
    this.editedUser.name = this.editForm.value.name;
    this.editedUser.userName = this.editForm.value.userName;
    this.editedUser.emailAddress = this.editForm.value.emailAddress;
    this.editedUser.gender = this.editForm.value.gender;
    this.editedUser.hobbies = this.editForm.value.hobbies;
    this.editedUser.phoneNumber = this.editForm.value.phoneNumber;
    this.editedUser.imagePath = this.editForm.value.imagePath;
    this.editedUser.status = this.editForm.value.status;
    this.editedUser.id = this.currentUser.id;

    this.usersService.onEditPost(this.editedUser);
    this.router.navigate(['/users', this.editedUser.userName]);
    this.showUpdateToatr();
  }

  onBackToProfile() {
    this.router.navigate(['/users', this.id]);
  }

  onDeleteProfile() {
    this.triggerDeleteModal();
  }

  showUpdateToatr() {
    const firstName = this.editedUser.name.slice(
      0,
      this.editedUser.name.indexOf(' ')
    );

    this.toastr.info('Your profile is updated.', `Hello ${firstName}!`);
  }

  showDeleteToatr() {
    const firstName = this.currentUser.name.slice(
      0,
      this.currentUser.name.indexOf(' ')
    );
    this.toastr.error('Your profile is deleted.', `Hello ${firstName}`);
  }

  onModalDelete() {
    // console.log(this.currentUser);
    this.showDeleteToatr();
    this.timelineService.logDeletedAccount(this.currentUser);
    this.usersService.onDeleteProfile(this.currentUser);
    // this.authService.user.next(this.loggedInUser);
    this.router.navigate(['/create-profile']);
  }

  triggerDeleteModal() {
    const element = document.getElementById('deleteModalButton');
    element.click();
  }
}
