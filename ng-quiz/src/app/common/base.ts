import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { IQuizModel } from "../interfaces/quiz-model";
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

  getSec(date: Date) {
    return (date as any).seconds;
  }

  lock(quiz: IQuizModel): boolean {
    const entered = quiz?.users?.find(u => u?.uid === this.authService.user?.uid);
    if (!entered) {
      return false;
    }

    const time = (quiz?.questions.length as number) * environment.quizConfig.secPerQuest * 1000;
    console.log(this.getSec(entered.start));
    console.log(time);
    console.log(new Date().getTime())
    return this.getSec(entered.start) + time <= new Date().getTime();
  }
}
