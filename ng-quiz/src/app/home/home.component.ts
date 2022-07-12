import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Base } from '../common/base';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends Base {

  constructor(
    router: Router,
    authService: AuthService
  ) {
    super(router, authService);
  }
}
