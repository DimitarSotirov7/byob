import { Component } from '@angular/core';
import { IFormModel } from '../interfaces/form-model';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  serverError: string | undefined;
  formToggle: boolean = true; //Register

  constructor(public authService: AuthService) {
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
        this.authService.authMsg.emit('You are sign up successfully!');
      })
      .catch(err => {
        this.serverError = err.message;
        console.error(err);
    });
  }

  login(input: IFormModel) {
    this.authService.login(input)
      .then(res => {
        this.authService.authMsg.emit('You are sign in successfully!');
      })
      .catch(err => {
        this.serverError = err.message;
        console.error(err);
    });
  }
}
