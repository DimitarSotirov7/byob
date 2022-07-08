import { Component, Input } from '@angular/core';
import { IAnswerModel } from '../interfaces/answer-model';
import { IQuestionModel } from '../interfaces/question-model';
import { AuthService } from '../services/auth/auth.service';
import { QuestionService } from '../services/question/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  @Input() question: IQuestionModel;

  constructor(private authService: AuthService, private questionService: QuestionService) {
    this.question = {} as IQuestionModel;
  }

  select(answer: IAnswerModel) {
    this.question.selected = answer;
    this.questionService.addUser(this.question.id, this.authService?.uid as string, answer.id);
  }
}
