import { Component } from '@angular/core';
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

  categToggle: boolean = true; //New
  categories: { name: string, id: string, selected: boolean }[] | undefined;
  quizToggle: boolean = true; //New
  quizzes: { name: string, id: string, selected: boolean }[] | undefined;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private questionService: QuestionService
  ) {
    this.loadCategories();
    this.loadQuizzes();
  }

  submit(input: any) {
    this.addCategory(input);
  }

  private loadCategories() {
    this.categoryService.getAll().get().subscribe(res => {
      this.categories = res.docs.map(c => ({ ...c.data(), id: c.id })) as { name: string, id: string, selected: boolean }[];
    });
  }

  private loadQuizzes() {
    this.quizService.getAll().get().subscribe(res => {
      this.quizzes = res.docs.map(c => ({ ...c.data(), id: c.id })) as { name: string, id: string, selected: boolean }[];
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

  addCategory(input: any) {
    // Use category from input    
    if (input?.category) {
      const categName = this.capitalize(input.category);
      let categoryExists = this.categories?.some(c => c.name === categName);
      if (!categoryExists) {
        this.categoryService.add({ name: categName } as ICategoryModel)
          .then(data => {
            if (data.id) {
              this.authService.authMsg.emit('Category has been added successfully!');
              if (input?.quiz) {
                this.addQuiz(input.quiz, data.id);
              }
              return;
            }
        });
      }
    }

    // Use selected category
    const category = this.categories?.find(c => c.selected);
    if (category && input?.quiz) {
      this.addQuiz(input.quiz, category.id);
    } else {
      this.authService.authMsg.emit('You must choose category first');
    }
  }

  addQuiz(name: string, categoryId: string) {
    const quizName = this.capitalize(name);
    const quizExists = this.quizzes?.some(c => c.name === quizName);
    if (!quizExists) {
      this.quizService.add({ name: quizName, categoryId, questions: [] as IQuestionModel[] } as IQuizModel).then(data => {
        if (data.id) {
          this.authService.authMsg.emit('Quiz has been added successfully!');
        }
      });
    } else {
      this.authService.authMsg.emit('Quiz exists!');
    }
  }
}
