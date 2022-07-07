import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  menuOn: boolean = false;

  constructor(public authService: AuthService, private router: Router) { 
    this.subscriptionListener();
  }

  navigate(url: string = '/') {
    this.menuOn = false;
    this.router.navigateByUrl(url);
  }

  logout() {
    this.authService.logout()
    .then(res => {
      this.authService.authMsg.emit('You are sign out successfully!');
      this.navigate();
    })
    .catch(err => {
      console.error(err);
  });
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
