import { Injectable } from '@angular/core';
import { ITranslateModel } from 'src/app/interfaces/translate-model';
import { environment } from 'src/environments/environment';
import * as bg from "../../../assets/bg-translate.json";
import * as en from "../../../assets/en-translate.json";
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class TranslateService extends BaseService {

  cookieKey: string = 'nacionality';
  get state(): ITranslateModel {
    const lang = this.getCookie(this.cookieKey) ?? environment.translate[0];
    return lang === 'bg' ? bg : en;
  }

  constructor() {
    super();
  }

  set(language: string | undefined = undefined): void {
    if (!language) {
      this.state.language === 'bg' ?
      this.setCookie('en', this.cookieKey) :
      this.setCookie('bg', this.cookieKey);
    } else {
      this.setCookie(language, this.cookieKey)
    }
  }
}
