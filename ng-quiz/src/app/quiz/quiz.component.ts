import { Component, DoCheck, Output, SimpleChanges } from '@angular/core';
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
export class QuizComponent implements DoCheck {

  @Output() quiz: IQuizModel;
  id: string = this.route.snapshot.params.id;
  back: boolean = false; next: boolean = true;
  completed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private questionService: QuestionService) {
    this.quiz = {} as IQuizModel;
    this.load();
  }

  ngDoCheck(): void {
    if (this.quiz.currQuestion?.selected) {
      this.quiz.questions.forEach(q => {
        if (q.id === this.quiz.currQuestion.id) {
          q.selected = this.quiz.currQuestion?.selected;
        }
      });
    }

    if (this.quiz.questions?.every(q => q.selected)) {
      this.completed = true;
    }
  }

  load() {
    this.quizService.get(this.id).subscribe(quizRes => {
      this.quiz.name = quizRes.data()?.name;
      const questions = quizRes.data()?.questions;

      if (quizRes.data()?.categoryId) {
        this.categoryService.get(quizRes.data()?.categoryId).subscribe(res => {
          this.quiz.category = res.data().name;
        });
      }

      if (questions) {
        this.questionService.getAll().get().subscribe(questRes => {
          const questionsRes = questRes.docs.filter(q => questions.includes(q.id.toString()));
          const firstQuestionData = questionsRes[0].data();
          const firstQuestionAnswers = firstQuestionData.answers;
          const firstQuestionCorrect = firstQuestionData.correct;

          this.quiz.currQuestion = { 
            id: questionsRes[0].id,
            text: firstQuestionData.text,
            correct: firstQuestionData.correct,
          } as IQuestionModel;

          const questionToAnswer = [] as { questionId: string, answers: string[] }[];
          this.quiz.questions = [] as IQuestionModel[];
          questionsRes.forEach(q => {
            this.quiz.questions.push({
              id: q.id,
              text: q.data().text,
              answers: (q.data().answers as string[]).map(a => { return { id: a }}),
            } as IQuestionModel); 

            questionToAnswer.push({
              questionId: q.id,
              answers: q.data().answers
            });
          });

          this.questionService.getAnswers().get().subscribe(answRes => {
            this.quiz.currQuestion.answers = answRes.docs.filter(a => firstQuestionAnswers.includes(a.id)).map(a => {
              return {
                id: a.id,
                text: a.data().text
              } as IAnswerModel;
            });

            this.quiz.currQuestion.correct = answRes.docs.filter(a => firstQuestionCorrect === a.id).map(a => {
              return {
                id: a.id,
                text: a.data().text
              } as IAnswerModel;
            })[0];

            this.quiz.questions.forEach(q => {
              q.answers = q.answers.map(a => {
                return {
                  id: a.id,
                  text: answRes.docs.find(ar => ar.id === a.id)?.data().text
                } as IAnswerModel;
              });
            });
          });
        });
      }
    });
  }

  getQuestion(goto: number) {
    const currIndex = this.quiz.questions.findIndex(q => q.id === this.quiz.currQuestion.id);
    if (currIndex === -1) {
      throw 'page is out of range!'
      this.quiz.currQuestion = this.quiz.questions[0];
    }

    const nextIndex = currIndex + goto;
    if (!this.validPage(nextIndex)) {
      return;
    }

    this.back = nextIndex === 0 ? false : true;
    this.next = nextIndex === this.quiz.questions.length - 1 ? false : true;

    this.quiz.currQuestion = this.quiz.questions[currIndex + goto];
  }

  validPage(nextIndex: number | undefined = undefined): boolean {
    if (!nextIndex) {
      return true;
    }
    
    if (nextIndex < 0 || this.quiz.questions?.length <= nextIndex) {
      return false;
    }

    return true;
  }

  complete() {
    console.log('wow')
  }
}
