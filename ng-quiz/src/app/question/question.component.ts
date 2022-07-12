import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Base } from '../common/base';
import { IAnswerModel } from '../interfaces/answer-model';
import { IQuestionModel } from '../interfaces/question-model';
import { AuthService } from '../services/auth/auth.service';
import { QuestionService } from '../services/question/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent extends Base {

  @Input() question: IQuestionModel;

  constructor(
    router: Router,
    authService: AuthService,
    private questionService: QuestionService
  ) {
    super(router, authService);
    this.question = {} as IQuestionModel;
  }

  select(answer: IAnswerModel) {
    this.question.selected = answer.id;
    this.questionService.addUser(this.question.id, this.authService.user?.uid as string, answer.id);
  }
}
