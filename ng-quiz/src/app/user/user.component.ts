import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../common/base';
import { IFormModel } from '../interfaces/form-model';
import { AuthService } from '../services/auth/auth.service';
import { TranslateService } from '../services/translate/translate.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends Base {
  formToggle: boolean = false; //Login
  menu: any = this._menu.join;
  validation: any = this._menu.validations;
  messages: any = this._menu.messages;

  constructor(
    router: Router,
    authService: AuthService,
    menu: TranslateService,
    private route: ActivatedRoute,
  ) {
    super(router, authService, menu);
  }

  ngDoCheck(): void {
    if (this.authService.user?.uid && this.authService.preUrl) {
      this.navigate(this.authService.preUrl);
      this.authService.preUrl = undefined;
    }
  }

  submit(input: IFormModel) {
    if (this.formToggle) {
      this.register(input);
    } else {
      this.login(input);
    }
  }

  register(input: IFormModel) {
    this.authService.register(input)
      .then(res => {
        this.authService.addUserFirestore(res?.user);
        this.authService.authMsg.emit(this.messages.regSuccess);
        this.authService.setCookie(res?.user.uid);
        this.navigate('quizzes');
      })
      .catch(err => {
        this.serverError = this.handleServerError(err.message);
      });
  }

  login(input: IFormModel) {
    this.authService.login(input)
      .then(res => {
        this.authService.authMsg.emit(this.messages.logSuccess);
        this.authService.setCookie(res?.user.uid);
        this.navigate('quizzes');
      })
      .catch(err => {
        this.serverError = this.handleServerError(err.message);
      });
  }

  handleServerError(msg: string) {
    return msg.includes('auth/email-already-in-use') ? this.messages.userInUsed :
    msg.includes('auth/user-not-found') ? this.messages.userNotFound : msg;
  }
}
