import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import Toast from 'bootstrap/js/dist/toast';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserA } from '../auth/userA.model';
//import { bootstrap } from 'bootstrap';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  loggedInUser: UserA;

  private activatedSub1: Subscription;

  constructor(private authService: AuthService) {}

  @ViewChild('myToast', { static: true }) toastEl!: ElementRef<HTMLDivElement>;
  toast: Toast | null = null;

  ngOnInit(): void {
    this.activatedSub1 = this.authService.user.subscribe((loggedInUser) => {
      if (loggedInUser) {
        this.loggedInUser = loggedInUser;
      } else {
        this.loggedInUser = null;
      }
    });
    this.toast = new Toast(this.toastEl.nativeElement, {});
  }

  ngOnDestroy() {
    this.activatedSub1.unsubscribe();
  }

  show() {
    this.toast!.show();
  }
}
