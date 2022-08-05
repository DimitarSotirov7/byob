import { Component, Input, OnInit } from '@angular/core';
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
export class AlertComponent extends Base implements OnInit {

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

  ngOnInit(): void {
  }

  click(option: boolean) {
    if (option) {
      this.alert.confirm = true;
    } else {
      this.alert.cancel = true;
    }
  }
}
