import { COMPILER_OPTIONS, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category/category.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';
import { ICategoryModel } from '../interfaces/category-model';
import { AuthService } from '../services/auth/auth.service';
import { IQuizModel } from '../interfaces/quiz-model';
import { IQuestionModel } from '../interfaces/question-model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  categories: { name: string, id: string, selected: boolean }[] | undefined;
  quizzes: { name: string, id: string, selected: boolean }[] | undefined;
  rotateCateg: boolean = false; rotateQuiz: boolean = false;
  serverError: string | undefined;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private questionService: QuestionService
  ) {
  }

  submit(input: any) {
    if (input?.category?.length > 0) {
      this.addCategory(input.category);
    } else if (input?.quiz?.length > 0) {
      this.addQuiz(input.quiz);
    } else if (input?.question?.length > 0) {
      // Add question
    } else {
      this.authService.authMsg.emit('All the fields are empty!');
    }
  }

  loadCategories() {
    this.rotateCateg = true;
    this.categoryService.getAll().get().subscribe(res => {
      this.categories = res.docs.map(c => ({ ...c.data(), id: c.id })) as { name: string, id: string, selected: boolean }[];
      this.rotateCateg = false;
    });
  }

  loadQuizzes() {
    this.rotateQuiz = true;
    this.quizService.getAll().get().subscribe(res => {
      this.quizzes = res.docs.map(c => ({ ...c.data(), id: c.id })) as { name: string, id: string, selected: boolean }[];
      this.rotateQuiz = false;
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
              this.authService.authMsg.emit('Category has been added successfully!');
              if (this.categories) {
                this.loadCategories();
              }
            }
          }).catch(err => {
            this.serverError = err.message;
          });
      } else {
        this.authService.authMsg.emit('Category already exists!');
      }
    });
  }

  addQuiz(name: string) {
    name = this.capitalize(name);
    const categoryId = this.categories?.find(c => c.selected)?.id;
    if (!categoryId) {
      this.authService.authMsg.emit('You should select category first!');
      return;
    }
    this.quizService.getAll().get().subscribe(res => {
      const quizzes = res.docs.map(q => ({ name: q.data().name, categoryId: q.data().categoryId }));
      const quizExists = quizzes?.some(q => q.name === name && q.categoryId === categoryId);
      if (!quizExists) {
        this.quizService.add({ name, categoryId, questions: [] as IQuestionModel[] } as IQuizModel)
          .then(data => {
            if (data.id) {
              this.authService.authMsg.emit('Quiz has been added successfully!');
              if (this.quizzes) {
                this.loadQuizzes();
              }
            }
          }).catch(err => {
            this.serverError = err.message;
          });
      } else {
        this.authService.authMsg.emit('Quiz already exists!');
      }
    });
  }
}
