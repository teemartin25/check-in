import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActivityChange } from './timeline/activity-change.model';
import { User } from './user.model';
import { map } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { UserA } from './auth/userA.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  updatedActivities = new BehaviorSubject<ActivityChange[]>(null);
  updatedUsers = new BehaviorSubject<User[]>(null);
  authenticatedUser: UserA;
  selectedUser = new Subject<User>();

  users: User[] = [
    new User(
      `Martin Tee`,
      `teemartin25`,
      `tee.martinjames@gmail.com`,
      `male`,
      `watching movies`,
      639064524483,
      `https://e7.pngegg.com/pngimages/270/1020/png-clipart-chimpanzee-ape-monkey-monkey-mammal-animals-thumbnail.png`,
      `My first status`
    ),
    new User(
      `Conor McGregor`,
      `thenotorious`,
      `conorMcG@gmail.com`,
      `male`,
      `Training Mixed Martial Arts`,
      90544544483,
      `https://fighter-headshots.s3.amazonaws.com/ufc/Conor-McGregor.jpg`,
      `The fook1`
    ),
    new User(
      `Michael Jordan`,
      `jumpman23`,
      `thegoat@gmail.com`,
      `male`,
      `Playing Basketball`,
      4564648484,
      `https://media.gettyimages.com/photos/michael-jordan-of-the-chicago-bulls-dunks-against-jeff-malone-of-the-picture-id52298709?s=594x594`,
      `I'm the Goat1`
    ),
  ];
  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers() {
    return this.users;
  }

  onFetchPosts() {
    this.http
      .get<{ [key: string]: User }>(
        `https://martin-app-b2ffa-default-rtdb.firebaseio.com/posts.json`
      )
      .pipe(
        map((responseData) => {
          const postsArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          this.users = postsArray;
          this.updatedUsers.next(postsArray);

          return postsArray;
        })
      )
      .subscribe((data) => {
        // console.log(data);
      });
  }

  onCreatePost(addedUser: User) {
    this.users.push(
      new User(
        addedUser.name,
        addedUser.userName,
        addedUser.emailAddress,
        addedUser.gender,
        addedUser.hobbies,
        addedUser.phoneNumber,
        addedUser.imagePath,
        addedUser.status
      )
    );

    this.updatedUsers.next(this.users);
    this.http
      .post(
        'https://martin-app-b2ffa-default-rtdb.firebaseio.com/posts.json',
        addedUser
      )
      .subscribe((responseData) => {
        // console.log(responseData);
        this.onFetchPosts();
      });
  }

  onEditPost(editedUser: User) {
    const index = this.users.findIndex(
      (user) => editedUser.emailAddress === user.emailAddress
    );

    this.users[index] = new User(
      editedUser.name,
      editedUser.userName,
      editedUser.emailAddress,
      editedUser.gender,
      editedUser.hobbies,
      editedUser.phoneNumber,
      editedUser.imagePath,
      editedUser.status,
      editedUser.id
    );

    //console.log(this.users[index]);

    this.updatedUsers.next(this.users);

    this.http
      .put(
        `https://martin-app-b2ffa-default-rtdb.firebaseio.com/posts/${this.users[index].id}.json`,
        this.users[index]
      )
      .subscribe();
  }

  onDeleteProfile(deletedProfile: User) {
    const idey = deletedProfile.id;

    const index = this.users.findIndex(
      (user) => deletedProfile.emailAddress === user.emailAddress
    );

    this.http
      .delete(
        `https://martin-app-b2ffa-default-rtdb.firebaseio.com/posts/${this.users[index].id}.json`
      )
      .subscribe();
    this.users.splice(index, 1);
    this.updatedUsers.next(this.users);
  }

  addTimelineActivity(postData: ActivityChange[]) {
    this.http
      .put<ActivityChange[]>(
        `https://martin-app-b2ffa-default-rtdb.firebaseio.com/timeline.json`,
        postData
      )
      .subscribe((resdata) => {
        this.updatedActivities.next(postData);
        this.fetchTimelineActivity();
      });
  }

  fetchTimelineActivity() {
    this.http
      .get<ActivityChange[]>(
        `https://martin-app-b2ffa-default-rtdb.firebaseio.com/timeline.json`
      )
      .subscribe((responseData) => {
        this.updatedActivities.next(responseData);
      });
  }

  addNewStatus(updatedProfileStatus: User, newStatus) {
    //console.log(updatedProfileStatus);
    //console.log(this.users);

    const index = this.users.findIndex(
      (element) => element.emailAddress === updatedProfileStatus.emailAddress
    );

    this.users[index] = new User(
      updatedProfileStatus.name,
      updatedProfileStatus.userName,
      updatedProfileStatus.emailAddress,
      updatedProfileStatus.gender,
      updatedProfileStatus.hobbies,
      updatedProfileStatus.phoneNumber,
      updatedProfileStatus.imagePath,
      newStatus,
      updatedProfileStatus.id
    );

    this.updatedUsers.next(this.users);

    this.http
      .put(
        `https://martin-app-b2ffa-default-rtdb.firebaseio.com/posts/${this.users[index].id}.json`,
        this.users[index]
      )
      .subscribe();
  }
}
