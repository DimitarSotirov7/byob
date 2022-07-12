import { Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";

export class Base {
    serverError: string | undefined;
  
    constructor(private router: Router, public authService: AuthService) {
    }

    navigate(url: string = '/') {
      this.router.navigateByUrl(url);
    }
  
    sendMsg(msg: string = 'Attention') {
      this.authService.authMsg.emit(msg);
    }
  }
  