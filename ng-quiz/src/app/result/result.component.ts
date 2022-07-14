import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../common/base';
import { IQuizModel } from '../interfaces/quiz-model';
import { AuthService } from '../services/auth/auth.service';
import { TranslateService } from '../services/translate/translate.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent extends Base {

  id: string = this.route.snapshot.params.id;
  quiz: IQuizModel;

  constructor(
    router: Router,
    authService: AuthService,
    translateService: TranslateService,
    private route: ActivatedRoute,
  ) {
    super(router, authService, translateService);
    this.quiz = {} as IQuizModel;
  }

  // load() {
  //   const quiz = this.route.snapshot.data.quiz;
  //   this.time = this.setTime(quiz.data()?.questions);
  //   this.quiz.name = quiz.data()?.name;
  //   const questions = quiz.data()?.questions;

  //   if (quiz.data()?.categoryId) {
  //     this.categoryService.get(quiz.data()?.categoryId).subscribe(res => {
  //       this.quiz.category = res.data().name;
  //     });
  //   }

  //   if (questions) {
  //     this.questionService.getAll().get().subscribe(questRes => {
  //       const questionsRes = questRes.docs.filter(q => questions.includes(q.id.toString()));
  //       const questionToAnswer = [] as { questionId: string, answers: string[] }[];
  //       this.quiz.questions = [] as IQuestionModel[];
  //       questionsRes.forEach(q => {
  //         this.quiz.questions.push({
  //           id: q.id,
  //           text: q.data().text,
  //           answers: (q.data().answers as string[]).map(a => { return { id: a } }),
  //           users: q.data()?.users
  //         } as IQuestionModel);

  //         questionToAnswer.push({
  //           questionId: q.id,
  //           answers: q.data().answers
  //         });
  //       });

  //       this.questionService.getAnswers().get().subscribe(answRes => {
  //         this.quiz.questions.forEach(q => {
  //           q.answers = q.answers.map(a => {
  //             return {
  //               id: a.id,
  //               text: answRes.docs.find(ar => ar.id === a.id)?.data().text
  //             } as IAnswerModel;
  //           });
  //         });

  //         this.randomize();

  //         if (this.quiz.questions.length > 0) {
  //           this.quiz.currQuestion = this.quiz.questions[0];
  //         }
  //       });
  //     });
  //   }
  // }
}
