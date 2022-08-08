import { COMPILER_OPTIONS, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../services/category/category.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';
import { ICategoryModel } from '../interfaces/category-model';
import { AuthService } from '../services/auth/auth.service';
import { IQuizModel } from '../interfaces/quiz-model';
import { IQuestionModel } from '../interfaces/question-model';
import { IAnswerModel } from '../interfaces/answer-model';
import { Base } from '../common/base';
import { IAdminQuizModel } from '../interfaces/admin-quiz-model';
import { IAdminCategoryModel } from '../interfaces/admin-category-model';
import { TranslateService } from '../services/translate/translate.service';
import { IResultModel } from '../interfaces/result-model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent extends Base {

  categories: IAdminCategoryModel[] | undefined;
  quizzes: IAdminQuizModel[] | undefined;
  questions: { text: string, id: string, selected: boolean, answers: string[] }[] | undefined;
  rotateCateg: boolean = false; rotateQuiz: boolean = false; rotateQuest: boolean = false; rotateRes: boolean = false;
  fullForm: boolean = true;
  editExpire: string | undefined;
  results: IResultModel[] | undefined;
  winner: IResultModel | undefined;

  constructor(
    router: Router,
    authService: AuthService,
    menu: TranslateService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private questionService: QuestionService,
  ) {
    super(router, authService, menu);
  }

  submit(input: any) {
    if (input?.category?.length > 0) {
      this.addCategory(input.category);
    } else if (input?.quiz?.length > 0) {
      this.addQuiz(input.quiz);
    } else if (input?.question?.length > 0) {
      this.addQuestion(input.question);
    } else if (input?.answers?.length > 0) {
      this.addAnswers(input?.answers);
    } else {
      this.authService.authMsg.emit('All the fields are empty!');
    }
  }

  loadCategories() {
    this.rotateCateg = true;
    this.categoryService.getAll().get().subscribe(res => {
      this.categories = res.docs.map(c => ({ ...c.data(), id: c.id })) as IAdminCategoryModel[];
      this.rotateCateg = false;
    });
  }

  loadQuizzes() {
    this.rotateQuiz = true;
    this.quizService.getAll().get().subscribe(res => {
      this.quizzes = res.docs.map(c => ({ ...c.data(), id: c.id })) as IAdminQuizModel[];
      this.rotateQuiz = false;
    });
  }

  loadQuestions() {
    this.rotateQuest = true;
    const quizQuestions = this.quizzes?.find(q => q.selected)?.questions;
    if (!quizQuestions) {
      this.sendMsg('You should select a quiz first!');
      this.questions = undefined;
      this.rotateQuest = false;
      return;
    }
    this.questionService.getAll().get().subscribe(res => {
      this.questions = res.docs
        .filter(q => quizQuestions.includes(q.id))
        .map(c => ({ ...c.data(), id: c.id })) as { text: string, id: string, selected: boolean, answers: string[] }[];
      this.rotateQuest = false;
    });
  }

  selectItem(id: string) {
    this.categories = this.categories?.map(c => {
      if (c.id === id) {
        c.selected = !c.selected;
      } else {
        c.selected = false;
      }
      return c;
    })

    this.quizzes = this.quizzes?.map(q => {
      if (q.id === id) {
        q.selected = !q.selected;
      } else {
        q.selected = false;
      }
      return q;
    })

    this.questions = this.questions?.map(q => {
      if (q.id === id) {
        q.selected = !q.selected;
      } else {
        q.selected = false;
      }
      return q;
    })
  }

  capitalize(text: string): string {
    if (text.length < 1) {
      return text;
    }

    const firstChar = text.charAt(0).toUpperCase();
    return firstChar + text.slice(1);
  }

  addCategory(name: any) {
    name = this.capitalize(name);
    this.categoryService.getAll().get().subscribe(res => {
      const categories = res.docs.map(c => ({ name: c.data().name }));
      let categoryExists = categories?.some(c => c.name === name);
      if (!categoryExists) {
        this.categoryService.add({ name } as ICategoryModel)
          .then(data => {
            if (data.id) {
              this.sendMsg('Category has been added successfully!');
              if (this.categories) {
                this.loadCategories();
              }
            }
          }).catch(err => {
            this.serverError = err.message;
          });
      } else {
        this.sendMsg('Category already exists!');
      }
    });
  }

  addQuiz(name: string) {
    name = this.capitalize(name);
    const categoryId = this.categories?.find(c => c.selected)?.id;
    if (!categoryId) {
      this.sendMsg('You should select a category first!');
      return;
    }
    this.quizService.getAll().get().subscribe(res => {
      const quizzes = res.docs.map(q => ({ name: q.data().name, categoryId: q.data().categoryId }));
      const quizExists = quizzes?.some(q => q.name === name && q.categoryId === categoryId);
      if (!quizExists) {
        let date = new Date();
        let expire = new Date(date.setDate(date.getDate() + 90));//Add three year
        this.quizService.add({ name, categoryId, questions: [] as IQuestionModel[], expire } as IQuizModel)
          .then(data => {
            if (data.id) {
              this.sendMsg('Quiz has been added successfully!');
              if (this.quizzes) {
                this.loadQuizzes();
              }
            }
          }).catch(err => {
            this.serverError = err.message;
          });
      } else {
        this.sendMsg('Quiz already exists!');
      }
    });
  }

  addQuestion(text: string) {
    text = this.capitalize(text);
    const quizId = this.quizzes?.find(c => c.selected)?.id;
    if (!quizId) {
      this.authService.authMsg.emit('You should select a quiz first!');
      return;
    }
    this.questionService.getAll().get().subscribe(res => {
      const questions = res.docs.map(q => ({ text: q.data().text }));
      const questionExists = questions?.some(q => q.text === text); // Check for quiz as well!
      if (!questionExists) {
        this.questionService.add({ text, correct: "", answers: [] as IAnswerModel[] } as IQuestionModel)
          .then(data => {
            if (data.id) {
              this.authService.authMsg.emit('Question has been added successfully!');
              this.quizService.addQuestion(quizId, data.id);
            }
          }).catch(err => {
            this.serverError = err.message;
          });
      } else {
        this.authService.authMsg.emit('Question already exists!');
      }
    });
  }

  addAnswers(input: string) {
    const answers = input.split(/\r?\n/).map(a => this.capitalize(a));
    const question = this.questions?.find(q => q.selected);
    if (!question) {
      this.sendMsg('You should select a question first!');
    }
    this.questionService.addAnswers(answers)
      .then(res => {
        const answerIds = (res as { id: string }[]).map(a => a.id);
        if (answerIds) {
          this.sendMsg('Answers are added successfully!');
          this.questionService.updateAnswers(question?.id as string, answerIds);
        }
        if (question?.answers.length !== 0) {
          this.questionService.deleteAnswers(question?.answers as string[]);
        }
      })
      .catch(err => console.log(err.message));
  }

  getDate(date: Date) {
    return this.quizService.getDate(date);
  }

  editDate(input: any) {
    const expire = new Date(input.expire);
    this.quizService.updateExpire(this.editExpire as string, expire);
    this.editExpire = undefined;
  }

  selectDate(quiz: IAdminQuizModel) {
    if (this.editExpire === quiz.id) {
      this.editExpire = undefined;
    } else {
      this.editExpire = quiz.id;
    }
  }

  loadResults() {
    this.results = [];
    const quiz = this.quizzes?.find(q => q.selected);
    if (!quiz) {
      this.sendMsg('You should select quiz first!');
      return;
    }
    this.rotateRes = true;
    this.questionService.getAll().get().subscribe(questRes => {
      const questions = questRes.docs
        .map(q => ({ ...q.data(), users: q.data().users as { uid: string, selected: string }[], correct: q.data().correct, id: q.id }))
        .filter(q => quiz?.questions?.includes(q.id));
      questions?.forEach(q => {
        const correct = q.correct;
        const results = q?.users.map(u => {
          let points = 0;
          if (u.selected === correct) {
            points++;
          }
          return { uid: u.uid, points };
        });
        results?.forEach(r => {
          const result = this.results?.find(x => x.uid === r.uid);
          if (!result) {
            (this.results as IResultModel[])
              .push({ uid: r.uid, points: r.points });
          } else {
            this.results = this.results?.map(y => {
              if (y.uid === r.uid) {
                y.points += r.points;
              }
              return y;
            });
          }
        });
      });

      this.authService.getUsersFirestore().get().subscribe(userRes => {
        this.results = this.results?.map(u => {
          u.email = (userRes.docs as any[]).find(ur => ur.id === u.uid)?.data().email;
          return u;
        });
      });

      this.results = this.results?.filter(r => (quiz.users as { uid: string, start: Date }[]).some(u => u.uid === r.uid))
        .sort((a, b) => b.points - a.points);
      this.rotateRes = false;

      const maxPointsUsers = [] as IResultModel[]
      let highest = -1;
      this.results?.forEach(r => {
        if (highest === -1) {
          highest = r.points;
        }

        if (highest === r.points) {
          maxPointsUsers.push(r);
        } else {
          return;
        }
      })

      this.winner = this.randomize(maxPointsUsers)[0];
    });
  }

  removeUser(uid: string) {
    const quiz = this.quizzes?.find(q => q.selected);
    if (!quiz) {
      return;
    }
    this.quizService.removeUser(quiz.id, uid);
    this.questionService.removeUser(quiz.questions, uid);
    this.sendMsg('user id: ' + uid + 'is deleted.');
  }

  randomize(items: any[]) {
    const permItems = Array.from(items);
    const tempItems = [] as any[];
    const length = permItems.length;
    for (let i = 0; i < length; i++) {
      const random = Math.floor(Math.random()*permItems.length);
      const item = permItems.splice(random, 1)[0];

      tempItems.push(item);
    }
    return tempItems;
  }
}
