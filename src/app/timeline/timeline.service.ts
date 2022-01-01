import { Injectable } from '@angular/core';
import { User } from '../user.model';
import { UsersService } from '../users.service';
import { ActivityChange } from './activity-change.model';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  activities: ActivityChange[] = [];

  currentActivity: ActivityChange = {
    activity: null,
    date: null,
    whoChangedIt: null,
    whatWasChanged: null,
    pronoun: null,
    keyUpdated: null,
    oldData: null,
    newData: null,
  };

  constructor(private usersService: UsersService) {}

  logActivityChange(oldData: User, newData: User) {
    this.usersService.updatedActivities.subscribe((activities) => {
      if (activities) this.activities = activities;
    });

    for (const key in oldData) {
      if (key === 'id') continue;
      if (key === 'firebaseId') continue;

      let pronoun: string;

      if (oldData.gender === 'male') pronoun = 'his';
      if (oldData.gender === 'female') pronoun = 'her';

      if (oldData[key] !== newData[key]) {
        this.currentActivity.activity = `The ${key} was changed!`;
        this.currentActivity.date = new Date();
        this.currentActivity.whoChangedIt = oldData.name;
        this.currentActivity.whatWasChanged = 'updatedAccount';
        this.currentActivity.pronoun = pronoun;
        this.currentActivity.keyUpdated = key;
        this.currentActivity.oldData = oldData[key];
        this.currentActivity.newData = newData[key];

        if (this.activities === null) {
          this.activities = [];
        }

        this.activities.push(
          new ActivityChange(
            this.currentActivity.activity,
            this.currentActivity.date,
            this.currentActivity.whoChangedIt,
            this.currentActivity.whatWasChanged,
            this.currentActivity.pronoun,
            this.currentActivity.keyUpdated,
            this.currentActivity.oldData,
            this.currentActivity.newData
          )
        );

        // console.log(this.activities);

        this.usersService.addTimelineActivity(this.activities);
        this.usersService.updatedActivities.next(this.activities);
      }
    }
  }

  logDeletedAccount(deletedData: User) {
    this.usersService.updatedActivities.subscribe((activities) => {
      this.activities = activities;
    });

    //console.log(deletedData);
    let pronoun: string;

    if (deletedData.gender === 'male') pronoun = 'his';
    if (deletedData.gender === 'female') pronoun = 'her';

    this.currentActivity.activity = `${deletedData.name} deleted ${pronoun} profile!`;
    this.currentActivity.date = new Date();
    this.currentActivity.whoChangedIt = deletedData.name;
    this.currentActivity.whatWasChanged = 'deletedAccount';
    this.currentActivity.pronoun = pronoun;

    if (this.activities === null) {
      this.activities = [];
    }

    this.activities.push(
      new ActivityChange(
        this.currentActivity.activity,
        this.currentActivity.date,
        this.currentActivity.whoChangedIt,
        this.currentActivity.whatWasChanged,
        this.currentActivity.pronoun
      )
    );

    this.usersService.addTimelineActivity(this.activities);
    this.usersService.updatedActivities.next(this.activities);
  }

  logNewAccount(newData: User) {
    this.usersService.updatedActivities.subscribe((activities) => {
      this.activities = activities;
    });

    let pronoun: string;

    if (newData.gender === 'male') pronoun = 'his';
    if (newData.gender === 'female') pronoun = 'her';

    this.currentActivity.activity = `${newData.name} created a new profile!`;
    this.currentActivity.date = new Date();
    this.currentActivity.whoChangedIt = newData.name;
    this.currentActivity.whatWasChanged = 'newAccount';
    this.currentActivity.pronoun = pronoun;

    if (this.activities === null) {
      this.activities = [];
    }

    this.activities.push(
      new ActivityChange(
        this.currentActivity.activity,
        this.currentActivity.date,
        this.currentActivity.whoChangedIt,
        this.currentActivity.whatWasChanged,
        this.currentActivity.pronoun
      )
    );

    this.usersService.addTimelineActivity(this.activities);
    this.usersService.updatedActivities.next(this.activities);
  }

  logNewStatus(activeProfileStatus: User, newStatus) {
    this.usersService.updatedActivities.subscribe((activities) => {
      this.activities = activities;
    });

    let pronoun: string;

    if (activeProfileStatus.gender === 'male') pronoun = 'his';
    if (activeProfileStatus.gender === 'female') pronoun = 'her';

    this.currentActivity.activity = `${activeProfileStatus.name} updated the status!`;
    this.currentActivity.date = new Date();
    this.currentActivity.whoChangedIt = activeProfileStatus.name;
    this.currentActivity.whatWasChanged = 'newStatus';
    this.currentActivity.pronoun = pronoun;
    this.currentActivity.keyUpdated = 'statuses';
    this.currentActivity.oldData = activeProfileStatus.status;
    this.currentActivity.newData = newStatus;

    // console.log(activeProfileStatus);
    // console.log(newStatus);

    if (this.activities === null) {
      this.activities = [];
    }

    this.activities.push(
      new ActivityChange(
        this.currentActivity.activity,
        this.currentActivity.date,
        this.currentActivity.whoChangedIt,
        this.currentActivity.whatWasChanged,
        this.currentActivity.pronoun,
        this.currentActivity.keyUpdated,
        this.currentActivity.oldData,
        this.currentActivity.newData
      )
    );

    this.usersService.addTimelineActivity(this.activities);
    this.usersService.updatedActivities.next(this.activities);
  }
}
