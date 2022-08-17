import { Component, DoCheck, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuestionModel } from '../interfaces/question-model';
import { IAnswerModel } from '../interfaces/answer-model';
import { IQuizModel } from '../interfaces/quiz-model';
import { CategoryService } from '../services/category/category.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';
import { AuthService } from '../services/auth/auth.service';
import { Base } from '../common/base';
import { TranslateService } from '../services/translate/translate.service';
import { ITimeModel } from '../interfaces/time-model';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent extends Base implements DoCheck, OnDestroy {

  @Output() quiz: IQuizModel;
  id: string = this.route.snapshot.params.id;
  menu: any = this._menu.quiz;
  messages: any = this._menu.messages;
  back: boolean = false; next: boolean = true;
  completed: boolean = false;
  interval: any;
  time: ITimeModel | undefined;
  timer: string = '00:00';

  constructor(
    router: Router,
    authService: AuthService,
    private route: ActivatedRoute,
    menu: TranslateService,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private questionService: QuestionService,
  ) {
    super(router, authService, menu);
    this.quiz = {} as IQuizModel;
    this.subscriptionListener();
  }

  ngOnInit() {
    this.load();
    this.addUser();
    this.setTimer();
  }
  
  ngOnDestroy(): void {
    clearInterval(this.interval);
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

  addUser() {
    this.quizService.addUser(this.id, this.authService.user?.uid as string);
  }

  load() {
    this.quiz.id = this.id;
    const quiz = this.route.snapshot.data.quiz;
    const quizInfo = { questions: quiz.data()?.questions, users: quiz.data()?.users };
    const timeLeft = this.getTime(quizInfo as IQuizModel);
    this.time = this.getMinSec(timeLeft);
    this.quiz.name = quiz.data()?.name;
    const questions = quiz.data()?.questions;

    if (quiz.data()?.categoryId) {
      this.categoryService.get(quiz.data()?.categoryId).subscribe(res => {
        this.quiz.category = res.data().name;
      });
    }

    if (questions) {
      this.questionService.getAll().get().subscribe(questRes => {
        const questionsRes = questRes.docs.filter(q => questions.includes(q.id.toString()));
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
                text: answRes.docs.find(ar => ar.id === a.id)?.data().text
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

  complete(success: boolean = true) {
    this.quizService.setCompleted(this.quiz.id, this.authService.user.uid as string);
    if (success) {
      this.sendMsg(this.messages.quizCompleted);
    } else {
      this.sendMsg(this.messages.timeOver);
    }
    if (!Array.isArray(this.quizService.completed)) {
      this.quizService.completed = [];
    }
    this.quizService.completed.push(this.quiz.id);
    this.navigate('quizzes');
  }

  setTimer() {
    if (!this.time) {
      return;
    }
    var minutes = this.time?.minutes;
    var seconds = this.time?.seconds;
    var me = this;
    this.interval = setInterval(function () {
      if (seconds === 0) {
        seconds = 59;
        minutes = (minutes as number) - 1;
      } else {
        seconds = (seconds as number) - 1;
      }
      if (minutes === 0 && seconds === 0) {
        me.timer = '';
        me.complete(false);
      }
      me.timer = me.quizService.getTimer({ minutes, seconds });
    }, 1000);
  }

  goBack() {
    this.navigate('/quizzes');
  }

  shake() {
    const delimiter = this.timer.indexOf(':');
    const minutes = Number(this.timer.slice(0, delimiter));
    const seconds = Number(this.timer.slice(delimiter + 1));
    if (minutes == 0 && seconds < 10) {
      return 'shake-fast';
    } else if (seconds % 5 === 0) {
      return 'shake';
    } else {
      return '';
    }
  }

  private subscriptionListener(): void {
    this.event.push(this.translateService.onChange.subscribe(res => {
      this.menu = this.translateService.state.quiz;
    }));
  }
}
