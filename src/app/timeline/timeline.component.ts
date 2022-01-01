import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from '../users.service';
import { ActivityChange } from './activity-change.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  activities: ActivityChange[];
  panelOpenState = false;
  private activatedSub1: Subscription;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.activatedSub1 = this.usersService.updatedActivities.subscribe(
      (updatedActivities) => {
        if (updatedActivities) {
          //console.log(updatedActivities);
          this.activities = updatedActivities.slice().reverse();
        }
      }
    );
    //console.log(this.activities);
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
  }
}
