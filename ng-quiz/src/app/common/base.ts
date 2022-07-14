import { Router } from "@angular/router";
import { ITranslateModel } from "../interfaces/translate-model";
import { AuthService } from "../services/auth/auth.service";
import { TranslateService } from "../services/translate/translate.service";

export class Base {
    serverError: string | undefined;
    _menu: ITranslateModel = this.translateService.get();
    messages: any = this._menu.messages;
  
    constructor(public router: Router, public authService: AuthService, private translateService: TranslateService) {
    }

    navigate(url: string = '/') {
      this.router.navigateByUrl(url);
    }
  
    sendMsg(msg: string = this.messages.attention) {
      this.authService.authMsg.emit(msg);
    }
  }
  