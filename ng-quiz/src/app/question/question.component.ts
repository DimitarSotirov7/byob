import { Component, DoCheck, Input } from '@angular/core';
import { IAnswerModel } from '../interfaces/answer-model';
import { IQuestionModel } from '../interfaces/question-model';
import { AuthService } from '../services/auth/auth.service';
import { QuestionService } from '../services/question/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements DoCheck {

  @Input() question: IQuestionModel;

  constructor(public authService: AuthService, private questionService: QuestionService) {
    this.question = {} as IQuestionModel;
  }

  ngDoCheck(): void {
  //  if (this.question?.users && !this.question?.selected) {
  //   this.question.selected = this.question?.users.find(q => q.uid === this.authService?.uid )?.selected;
  //   console.log(this.question.selected)
  //  }
  }

  select(answer: IAnswerModel) {
    this.question.selected = answer.id;
    this.questionService.addUser(this.question.id, this.authService?.uid as string, answer.id);
  }
}
