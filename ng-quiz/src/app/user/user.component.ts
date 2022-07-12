import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Base } from '../common/base';
import { IFormModel } from '../interfaces/form-model';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent extends Base {
  formToggle: boolean = false; //Login

  constructor(
    router: Router,
    authService: AuthService
  ) {
    super(router, authService);
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
        this.authService.authMsg.emit('You are sign up successfully!');
        this.navigate('quizzes');
      })
      .catch(err => {
        this.serverError = err.message;
      });
  }

  login(input: IFormModel) {
    this.authService.login(input)
      .then(res => {
        this.authService.authMsg.emit('You are sign in successfully!');
        this.navigate('quizzes');
      })
      .catch(err => {
        this.serverError = err.message;
      });
  }
}
