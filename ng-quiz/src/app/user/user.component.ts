import { Component } from '@angular/core';
import { IFormModel } from '../interfaces/form-model';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {

  authState = this.authService.authState;
  serverError: string | undefined;
  cookieName: string = 'b%7y@80*6b9!';
  logged: boolean = document.cookie.includes(this.cookieName);
  formTitle: string = 'Sign Up';

  constructor(private authService: AuthService) {
    console.log(this.authState)
  }

  submit(input: IFormModel) {

    const cookies = document.cookie;
    console.log(cookies)
    if (this.logged) {
      return;
    }

    this.register(input);
  }

  register(input: IFormModel) {
    this.authService.register(input)
      .then(res => {
        this.formTitle = "Sign In";
      })
      .catch(err => {
        this.serverError = err.message;
      console.log(err);
    });
  }

  login(input: IFormModel) {
    this.authService.login(input)
      .then(res => {
        document.cookie = `${this.cookieName}=${res.user.uid}`;
      })
      .catch(err => {
        this.serverError = err.message;
      console.log(err);
    });
  }

  logout() {
    
  }
}
