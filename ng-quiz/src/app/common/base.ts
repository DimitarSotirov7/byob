import { Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { TranslateService } from "../services/translate/translate.service";

export class Base {
    serverError: string | undefined;
  
    constructor(private router: Router, public authService: AuthService, private menu: TranslateService) {
    }

    navigate(url: string = '/') {
      this.router.navigateByUrl(url);
    }
  
    sendMsg(msg: string = 'Attention') {
      this.authService.authMsg.emit(msg);
    }
  }
  