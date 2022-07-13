import { Injectable } from '@angular/core';
import { ITranslateModel } from 'src/app/interfaces/translate-model';
import { environment } from 'src/environments/environment';
import * as bg from "../../../assets/bg-translate.json";

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  langState: string = environment.translate;

  constructor() { }

  get(language: string = "bg"): ITranslateModel {
    return bg;
  }
}
