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
  user: string | undefined;
  menu: any = this._menu.nav;
  messages: any = this._menu.messages;

  constructor(
    router: Router,
    authService: AuthService,
    translateService: TranslateService,
  ) {
    super(router, authService, translateService);
    this.subscriptionListener();
    this.getUser();
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
        this.authService.load();
        this.user = undefined;
        this.navigate();
      })
      .catch(err => {
        console.error(err);
      });
  }

  setLang(lang: string) {
    lang = lang === 'bg' ? 'en' : 'bg';
    this.translateService.set(lang);
    this.translateService.onChange.emit(true);
  }

  private getUser() {
    this.authService.getUser().subscribe(res => {
      const email = res?.email;
      if (!email) {
        return;
      }
      const delimiter = email.indexOf('@');
      this.user = email.substring(0, delimiter);
    });
  }

  private subscriptionListener(): void {
    this.event.push(this.authService.authMsg.subscribe(msg => {
      this.notify = msg;
      setTimeout(() => {
        this.notify = undefined;
      }, 2000);
    }));
    this.event.push(this.translateService.onChange.subscribe(res => {
      this.menu = this.translateService.state.nav;
    }));
  }
}
