import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Base } from '../common/base';
import { IAnswerModel } from '../interfaces/answer-model';
import { IQuestionModel } from '../interfaces/question-model';
import { IQuizModel } from '../interfaces/quiz-model';
import { AuthService } from '../services/auth/auth.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';
import { TranslateService } from '../services/translate/translate.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent extends Base {

  id: string = this.route.snapshot.params.id;
  quiz: IQuizModel;
  evaluate: { questionId: string, correct: string, selected: string }[] | undefined;
  menu: any = this._menu.quiz;
  back: boolean = false; next: boolean = true;

  constructor(
    router: Router,
    authService: AuthService,
    translateService: TranslateService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private questionService: QuestionService,
  ) {
    super(router, authService, translateService);
    this.quiz = {} as IQuizModel;
    this.load();
    this.subscriptionListener();
  }

  load() {
    const quiz = this.route.snapshot.data.quiz;
    this.quiz.name = quiz.data()?.name;
    const questions = quiz.data()?.questions;

    if (questions) {
      this.questionService.getAll().get().subscribe(questRes => {
        const questionsRes = questRes.docs.filter(q => questions.includes(q.id.toString()));
        
        this.evaluate = [];
        questionsRes.forEach(q => {
          const selected = (q.data()?.users as { uid: string, selected: string }[])
            ?.find(u => u.uid === this.authService.user?.uid)?.selected;
            
          const record = { questionId: q.id, correct: q.data()?.correct, selected: selected as string };
          this.evaluate?.push(record);
        });

        const questionToAnswer = [] as { questionId: string, answers: string[] }[];
        this.quiz.questions = [] as IQuestionModel[];
        questionsRes.forEach(q => {
          this.quiz.questions.push({
            id: q.id,
            text: q.data().text,
            answers: (q.data().answers as string[]).map(a => { return { id: a } }),
            users: q.data()?.users
          } as IQuestionModel);

          questionToAnswer.push({
            questionId: q.id,
            answers: q.data().answers
          });
        });

        this.questionService.getAnswers().get().subscribe(answRes => {
          this.quiz.questions.forEach(q => {
            q.answers = q.answers.map(a => {
              return {
                id: a.id,
                text: answRes.docs?.find(ar => ar.id === a.id)?.data().text
              } as IAnswerModel;
            });
          });

          this.quiz.questions = this.quizService.randomize(this.quiz.questions);

          if (this.quiz.questions.length > 0) {
            this.quiz.currQuestion = this.quiz.questions[0];
          }
        });
      });
    }
  }

  getQuestion(goto: number) {
    const currIndex = this.quiz.questions?.findIndex(q => q.id === this.quiz.currQuestion.id);
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

  getClassAnswer(questionId: string, answerId: string) {
    const question = this.evaluate?.find(q => q.questionId === questionId);
    return answerId === question?.correct ? 'correct' : answerId === question?.selected ? 'selected' : '';
  }

  getClassQuestion(questionId: string) {
    const question = this.evaluate?.find(q => q.questionId === questionId);
    return this.quiz.currQuestion?.id === questionId ? 'on' : question?.correct === question?.selected ? 'success' : 'fail';
  }

  private subscriptionListener(): void {
    this.event.push(this.translateService.onChange.subscribe(res => {
      this.menu = this.translateService.state.quiz;
    }));
  }
}
