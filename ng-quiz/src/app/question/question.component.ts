import { Component, Input } from '@angular/core';
import { IQuestionModel } from '../interfaces/question-model';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent {

  @Input() question: IQuestionModel;

  constructor() {
    this.question = {} as IQuestionModel;
  }
}
