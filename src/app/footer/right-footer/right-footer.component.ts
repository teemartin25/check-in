import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UserA } from 'src/app/auth/userA.model';
import { TimelineService } from 'src/app/timeline/timeline.service';
import { User } from 'src/app/user.model';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-right-footer',
  templateUrl: './right-footer.component.html',
  styleUrls: ['./right-footer.component.css'],
})
export class RightFooterComponent implements OnInit, OnDestroy {
  statusButton: string = '';
  statusForm: FormGroup;
  newStatus: string;
  loggedInUser: UserA;
  selectedUser: User;
  users: User[];
  isLoggedInUserHasOwnProfile: boolean;

  private activatedSub1: Subscription;
  private activatedSub2: Subscription;
  private activatedSub3: Subscription;
  private activatedSub4: Subscription;

  constructor(
    private usersService: UsersService,
    private timelineService: TimelineService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.statusForm = new FormGroup({
      statusMessage: new FormControl(null, Validators.required),
    });

    this.activatedSub1 = this.authService.user.subscribe((user) => {
      if (user) {
        this.customAsyncFunction();
      } else {
        this.selectedUser = null;
      }
    });

    this.activatedSub2 = this.usersService.updatedUsers.subscribe(
      (updatedUsers) => {
        this.customAsyncFunction();
      }
    );
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
    this.activatedSub2.unsubscribe();
    this.activatedSub3.unsubscribe();
    this.activatedSub4.unsubscribe();
  }

  updateDropdownStatus(value) {
    this.statusButton = value;

    if (value === 'offline') this.statusForm.reset();
  }

  onSubmit() {
    if (this.statusButton === 'online') {
      this.newStatus = '🟢 ' + this.statusForm.value.statusMessage;
    }

    if (this.statusButton === 'offline') {
    }

    if (this.statusButton === 'busy') {
      this.newStatus = '🔴 ' + this.statusForm.value.statusMessage;
    }

    this.statusForm.reset();
    this.statusButton = '';

    this.showSuccessToatr();

    this.timelineService.logNewStatus(this.selectedUser, this.newStatus);
    this.usersService.addNewStatus(this.selectedUser, this.newStatus);
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

  async customAsyncFunction() {
    const data: any = await Promise.all([
      this.getLoggedInUser(),
      this.getUpdatedUsers(),
    ]);

    const [loggedInUser, updatedUsers] = data;

    // console.log(loggedInUser);
    // console.log(updatedUsers);

    const index = updatedUsers.findIndex(
      (user) => user.emailAddress === loggedInUser.email
    );

    this.selectedUser = updatedUsers[index];
  }

  showSuccessToatr() {
    const firstName = this.selectedUser.name.slice(
      0,
      this.selectedUser.name.indexOf(' ')
    );

    this.toastr.info('Your status is updated.', `Hello ${firstName}!`);
  }

  // Just remove this function to disable to "You're Offline option on Status Update. Also remove the click listener on the HTML file.
  onOfflineClick() {
    //  console.log('offline clicked!');
    this.newStatus = '🔘 Offline ';
    this.statusButton = 'offline';
    this.showSuccessToatr();
    this.timelineService.logNewStatus(this.selectedUser, this.newStatus);
    this.usersService.addNewStatus(this.selectedUser, this.newStatus);
  }
}
