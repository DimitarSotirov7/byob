import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Base } from 'src/app/common/base';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService } from 'src/app/services/translate/translate.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent extends Base {

  menu: any = this._menu.notFound;

  constructor(
    router: Router,
    authService: AuthService,
    translateService: TranslateService,
  ) {
    super(router, authService, translateService);
    this.subscriptionListener();
  }

  private subscriptionListener(): void {
    this.event.push(this.translateService.onChange.subscribe(res => {
      this.menu = this.translateService.state.notFound;
    }));
  }
}
