import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category/category.service';
import { QuestionService } from '../services/question/question.service';
import { QuizService } from '../services/quiz/quiz.service';
import { ICategoryModel } from '../interfaces/category-model';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  categories: { name: string, id: string, selected: boolean }[] | undefined;
  categToggle: boolean = true; //New

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private categoryService: CategoryService,
    private questionService: QuestionService
  ) {
    this.loadCategories();
  }

  add(input: any) {
    if (input?.category) {
      const name = this.capitalize(input.category);
      const categoryExists = this.categories?.some(c => c.name === name);
      if (!categoryExists) {
        this.categoryService.add({ name } as ICategoryModel).then(data => {
          if (data.id) {
            this.authService.authMsg.emit('Category has been added successfully!');
          }
        });
      } else {
        this.authService.authMsg.emit('Category exists!');
      }
    }
  }

  loadCategories() {
    this.categoryService.getAll().get().subscribe(res => {
      this.categories = res.docs.map(c => ({ ...c.data(), id: c.id })) as { name: string, id: string, selected: boolean }[];
    });
  }

  capitalize(text: string): string {
    if (text.length < 1) {
      return text;
    }

    const firstChar = text.charAt(0).toUpperCase();
    return firstChar + text.slice(1);
  }
}
