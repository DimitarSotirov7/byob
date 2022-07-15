import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Base } from 'src/app/common/base';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService } from 'src/app/services/translate/translate.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent extends Base {

  notify: string | undefined;
  event: Subscription[] = [];
  menuOn: boolean = false;
  email: string | null | undefined = this.authService.user?.email;
  menu: any = this._menu.nav;
  messages: any = this._menu.messages;

  constructor(
    router: Router,
    authService: AuthService,
    translateService: TranslateService,
  ) {
    super(router, authService, translateService);
    this.subscriptionListener();
  }
  
  _navigate(url: string = '/') {
    this.menuOn = false;
    this.navigate(url);
  }

  logout() {
    this.authService.logout()
    .then(res => {
      this.authService.authMsg.emit(this.messages.outSuccess);
      this.authService.removeCookie();
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
      }, 2000);
    }));
  }
}
