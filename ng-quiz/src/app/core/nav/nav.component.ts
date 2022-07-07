import { Component } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  notify: string | undefined;
  event: Subscription[] = [];

  constructor(public authService: AuthService) { 
    this.subscriptionListener();
  }

  private subscriptionListener(): void {
    this.event.push(this.authService.authMsg.subscribe(msg => {
      this.notify = msg;
      setTimeout(() => {
        this.notify = undefined;
      }, 1500);
    }));
  }
}
