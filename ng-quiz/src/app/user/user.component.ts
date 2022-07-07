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
  uid: string | undefined = this.authService.uid;
  formToggle: boolean = true; //Register

  constructor(private authService: AuthService) {
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
        this.uid = res.user.uid;
      })
      .catch(err => {
        this.serverError = err.message;
        console.error(err);
    });
  }

  login(input: IFormModel) {
    this.authService.login(input)
      .then(res => {
        this.uid = res.user.uid;
      })
      .catch(err => {
        this.serverError = err.message;
        console.error(err);
    });
  }

  logout() {
    this.authService.logout()
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      this.serverError = err.message;
      console.error(err);
  });
  }
}
