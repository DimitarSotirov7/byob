import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { IQuizModel } from "../interfaces/quiz-model";
import { ITimeModel } from "../interfaces/time-model";
import { ITranslateModel } from "../interfaces/translate-model";
import { AuthService } from "../services/auth/auth.service";
import { TranslateService } from "../services/translate/translate.service";

export class Base {
  serverError: string | undefined;
  _menu: ITranslateModel = this.translateService.get();
  messages: any = this._menu.messages;

  constructor(
    public router: Router,
    public authService: AuthService,
    private translateService: TranslateService
  ) {
  }

  navigate(url: string = '/') {
    this.router.navigateByUrl(url);
  }

  sendMsg(msg: string = this.messages.attention) {
    this.authService.authMsg.emit(msg);
  }

  getTimestamp(date: Date, days: number | undefined = undefined): number {
    let result = (date as any).seconds * 1000;
    if (days) {
      result += (days * 24 * 60 * 60 * 1000);
    }
    return result;
  }

  getTime(quiz: IQuizModel): number {
    const entered = quiz?.users?.find(u => u?.uid === this.authService.user?.uid);
    const time = (quiz?.questions.length as number) * environment.quizConfig.secPerQuest * 1000;

    if (!entered) {
      return time;
    }

    const timeLeft = (this.getTimestamp(entered.start) + time) - new Date().getTime();
    return timeLeft;
  }

  getMinSec(timestamp: number): ITimeModel | undefined {
    const sec = timestamp / 1000;
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return { minutes, seconds };
  }
}
