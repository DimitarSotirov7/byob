import { Component, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IQuestionModel } from '../interfaces/question-model';
import { IAnswerModel } from '../interfaces/answer-model';
import { IQuizModel } from '../interfaces/quiz-model';
import { CategoryService } from '../services/category/category.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent {

  id: string = this.route.snapshot.params.id;
  quiz: IQuizModel;
  @Output() currQuestion: IQuestionModel;

  constructor(private route: ActivatedRoute, private quizService: QuizService, private categoryService: CategoryService, private questionService: QuestionService) {
    this.quiz = {} as IQuizModel;
    this.currQuestion = {} as IQuestionModel;
    this.load();
  }

  load() {
    this.quizService.get(this.id).subscribe(res => {
      this.quiz = res.data();
      if (res.data()?.categoryId) {
        this.categoryService.get(res.data()?.categoryId).subscribe(res => {
          this.quiz.category = res.data().name;
        });
      }
      if (res.data()?.questions) {
        this.questionService.get(res.data()?.questions[0]).subscribe(res => {
          this.currQuestion = res.data();

          const answers = res.data().answers;
          const correct = res.data().correct;
          this.questionService.getAnswers().get().subscribe(res => {
            this.currQuestion.answers = res.docs.filter(a => answers.includes(a.id)).map(a => {
              return {
                id: a.id,
                text: a.data().text
              };
            });

            this.currQuestion.correct = res.docs.filter(a => correct === a.id).map(a => {
              return {
                id: a.id,
                text: a.data().text
              };
            })[0];
          });
        });
      }
    });
  }

  getQuestion(page: number | undefined = undefined) {
    const index = page ? page - 1 : 0;
    return this.quiz?.questions[index];
  }
}
