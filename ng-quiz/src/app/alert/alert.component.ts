import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Base } from '../common/base';
import { IAlertModel } from '../interfaces/alert-model';
import { AuthService } from '../services/auth/auth.service';
import { TranslateService } from '../services/translate/translate.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent extends Base {

  @Input() alert: IAlertModel;
  menu: any = this._menu.alert;

  constructor(
    router: Router,
    authService: AuthService,
    menu: TranslateService,
  ) {
    super(router, authService, menu);
    this.alert = {} as IAlertModel;
  }

  click(option: boolean) {
    if (option) {
      this.alert.confirm = true;
      this.alert.cancel = false;
    } else {
      this.alert.cancel = true;
      this.alert.confirm = false;
    }
  }
}
