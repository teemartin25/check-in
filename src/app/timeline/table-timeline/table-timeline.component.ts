import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/users.service';
import { ActivityChange } from '../activity-change.model';

export interface ActivityInterface {
  activity: string;
  date: Date;
  whoChangedIt: string;
  whatWasChanged: string;
  pronoun: string;
  keyUpdated?: string;
  oldData?: string | number;
  newData?: string | number;
}

@Component({
  selector: 'app-table-timeline',
  templateUrl: './table-timeline.component.html',
  styleUrls: ['./table-timeline.component.css'],
})
export class TableTimelineComponent implements OnInit, OnDestroy {
  activities = new MatTableDataSource();

  displayedColumns: string[] = [
    'date',
    'whoChangedIt',
    'whatWasChanged',

    'keyUpdated',
    'oldData',
    'newData',
  ];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  private activatedSub1: Subscription;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.activatedSub1 = this.usersService.updatedActivities.subscribe(
      (updatedActivities) => {
        if (updatedActivities) {
          // console.log(updatedActivities);
          this.activities.data = updatedActivities.slice().reverse();
        }
      }
    );

    this.activities.filterPredicate = function (
      data: ActivityChange,
      filter: string
    ): boolean {
      return data.whoChangedIt.toLowerCase().includes(filter);
    };

    this.activities.sort = this.sort;
    this.activities.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.activities.filter = filterValue.trim().toLowerCase();
  }
}
