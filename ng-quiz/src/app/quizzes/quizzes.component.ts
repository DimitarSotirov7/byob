import { Component, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../common/base';
import { IAlertModel } from '../interfaces/alert-model';
import { IQuestionModel } from '../interfaces/question-model';
import { IQuizModel } from '../interfaces/quiz-model';
import { ITimeModel } from '../interfaces/time-model';
import { AuthService } from '../services/auth/auth.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';
import { TranslateService } from '../services/translate/translate.service';

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.css']
})
export class QuizzesComponent extends Base {

  quizzes: IQuizModel[] = [];
  categoryId: string = this.route.snapshot.params.id;
  menu: any = this._menu.quizzes;
  @Output() alert: IAlertModel;

  constructor(
    router: Router,
    authService: AuthService,
    translateService: TranslateService,
    private quizService: QuizService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
  ) {
    super(router, authService, translateService);
    this.alert = {} as IAlertModel;
  }

  ngOnInit() {
    this.quizService.getAll().get().subscribe(res => {
      this.quizzes = (res.docs as any[]).map(c => ({ ...c.data(), id: c.id }));

      if (this.categoryId) {
        this.quizzes = this.quizzes.filter(q => q?.categoryId === this.categoryId);
      }

      this.quizService.data = this.quizzes;

      this.quizzes = this.quizzes.map(q => {
        q.date = this.getDaysLeft(q.expire);
        q.timeLeft = this.getTime(q);
        q.time = this.getMinSec(q.timeLeft);
        return q;
      }).filter(q => q.date > 0);
      this.calcPoints();
    });
  }

  calcPoints() {
    this.questionService.getAll().get().subscribe(res => {
      const questions = res.docs
        .map(q => ({ ...q.data(), id: q.id }));
        
      this.quizzes = this.quizzes.map(quiz => {
        const quizQuest = questions.filter(quest => (quiz.questions as any[]).includes(quest.id));
        let correctCounter = 0;
        let counter = 0;
        quizQuest.forEach(qq => {
          if((qq as IQuestionModel)?.correct === (qq as IQuestionModel)?.users?.find(u => u.uid === this.authService.user?.uid)?.selected) {
            correctCounter++;
          };
          counter++;
        });
        quiz.points = Math.round(correctCounter / counter);
        return quiz;
      });
    })
  }

  calcStars(quizId: string) {
    const quiz = this.quizzes?.find(q => q.id === quizId);
    if (!quiz?.points) { return new Array(0); }
    return new Array(Math.ceil(5 * (quiz?.points as number)));
  }

  getDaysLeft(timestamp: any): number {
    const curr = new Date();
    const date = new Date((timestamp as any)?.seconds*1000);
    const daysLeft = (date.getTime() - curr.getTime()) / (86400 * 1000) + 1;
    if (daysLeft < -1) {
      return 0;
    }
    return Math.ceil(daysLeft);
  }

  getTimer(time: ITimeModel | undefined): string {
    return this.quizService.getTimer(time);
  }

  open(quizId: string) {
    this.alert.msg = 'След като потвърдите викторината, ще стартира незабавно и ще имате точно време за да я приключите.';
    console.log(quizId)
  }
}
