import { Router } from "@angular/router";
import { ITranslateModel } from "../interfaces/translate-model";
import { AuthService } from "../services/auth/auth.service";
import { TranslateService } from "../services/translate/translate.service";

export class Base {
    serverError: string | undefined;
    _menu: ITranslateModel = this.translateService.get();
  
    constructor(private router: Router, public authService: AuthService, private translateService: TranslateService) {
    }

    navigate(url: string = '/') {
      this.router.navigateByUrl(url);
    }
  
    sendMsg(msg: string = 'Attention') {
      this.authService.authMsg.emit(msg);
    }
  }
  