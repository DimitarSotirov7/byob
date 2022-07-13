import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from 'rxjs';
import { Base } from '../common/base';
import { IQuestionModel } from '../interfaces/question-model';
import { IQuizModel } from '../interfaces/quiz-model';
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

  constructor(
    router: Router,
    authService: AuthService,
    menu: TranslateService,
    private quizService: QuizService,
    private questionService: QuestionService,
    private route: ActivatedRoute,
  ) {
    super(router, authService, menu);
  }

  ngOnInit() {
    // this.quizzes = (this.route.snapshot.data.quiz.docs as any[]).map(c => ({ ...c.data(), id: c.id }));
    this.quizzes = this.quizService.data;
    if (this.categoryId) {
      this.quizzes = this.quizzes.filter(q => q?.categoryId === this.categoryId);
    }
    this.quizzes = this.quizzes.map(q => {
      q.date = this.getDaysLeft(q.expire);
      return q;
    });
    this.calcPoints();
  }

  lock(quizId: string): boolean {
    return (this.quizzes.find(q => q.id === quizId)?.users as string[])
      ?.includes(this.authService.user?.uid as string);
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
        quiz.points = correctCounter / counter;
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
}
